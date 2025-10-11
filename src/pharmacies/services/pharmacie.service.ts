import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacie } from '../models/pharmacie.model';
import {
  AyuntamientoPharmacy,
  AyuntamientoApiResponse,
} from '../interfaces/ayuntamiento-api.interface';
import { Validation } from '../../validations/models/validation.model';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class PharmacieService {
  private readonly TEXTO_GENERICO =
    'Además de las Farmacias que figuran en el cartel';

  constructor(
    @InjectRepository(Pharmacie)
    private readonly pharmacieRepository: Repository<Pharmacie>,
    @InjectRepository(Validation)
    private readonly validationRepository: Repository<Validation>,
  ) {}

  async getAllPharmacies(): Promise<Pharmacie[]> {
    return this.pharmacieRepository.find();
  }

  async getPharmacieById(id: string): Promise<Pharmacie> {
    const pharmacie = await this.pharmacieRepository.findOne({
      where: { id },
    });

    if (!pharmacie) {
      throw new NotFoundException(`Farmacia con ID ${id} no encontrada`);
    }

    return pharmacie;
  }

  async getTodayGuardPharmacies(): Promise<Pharmacie[]> {
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return this.pharmacieRepository.find({
      where: {
        guard_date: todayDate,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async syncWithAyuntamiento(): Promise<Pharmacie[]> {
    const today = new Date();
    const formattedDate = today
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-');

    const apiUrl = `http://www.zaragoza.es/sede/servicio/farmacia.json?tipo=guardia&fecha=${formattedDate}`;

    try {
      console.log(
        `[${new Date().toISOString()}] Sincronizando farmacias del ${formattedDate}...`,
      );

      const response: AxiosResponse<AyuntamientoApiResponse> =
        await axios.get(apiUrl);
      const apiPharmacies: AyuntamientoPharmacy[] = response.data.result;

      console.log(`Recibidas ${apiPharmacies.length} farmacias de la API`);

      if (apiPharmacies.length === 0) {
        console.log('No hay farmacias de guardia para esta fecha');
        return [];
      }

      const syncedPharmacies: Pharmacie[] = [];
      const guardDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      );

      let filteredCount = 0;

      for (const apiPharmacy of apiPharmacies) {
        const horario = apiPharmacy.guardia.horario || '';

        if (horario.includes(this.TEXTO_GENERICO)) {
          filteredCount++;
          console.log(
            `Ignorando farmacia con texto genérico: ${apiPharmacy.title}`,
          );
          continue;
        }

        let pharmacie = await this.pharmacieRepository.findOne({
          where: { external_id: apiPharmacy.id.toString() },
        });

        if (!pharmacie) {
          pharmacie = new Pharmacie();
          pharmacie.external_id = apiPharmacy.id.toString();
          pharmacie.name = apiPharmacy.title || 'Farmacia sin nombre';
          pharmacie.address = apiPharmacy.calle || 'Dirección no disponible';
          pharmacie.hours = horario || 'Consultar horario';
          pharmacie.phone = apiPharmacy.telefonos || 'No disponible';

          if (apiPharmacy.geometry && apiPharmacy.geometry.coordinates) {
            pharmacie.longitude = apiPharmacy.geometry.coordinates[0];
            pharmacie.latitude = apiPharmacy.geometry.coordinates[1];
          } else {
            pharmacie.latitude = null;
            pharmacie.longitude = null;
          }

          console.log(`Nueva farmacia: ${pharmacie.name}`);
        } else {
          const hasChanges =
            pharmacie.name !== (apiPharmacy.title || pharmacie.name) ||
            pharmacie.address !== (apiPharmacy.calle || pharmacie.address) ||
            pharmacie.hours !== (horario || pharmacie.hours) ||
            pharmacie.phone !== (apiPharmacy.telefonos || pharmacie.phone);

          if (hasChanges) {
            const deletedCount = await this.validationRepository.delete({
              pharmacyId: pharmacie.id,
            });

            console.log(
              `Farmacia ${pharmacie.name} modificada - ${deletedCount.affected || 0} validaciones reiniciadas`,
            );
          }

          pharmacie.name = apiPharmacy.title || pharmacie.name;
          pharmacie.address = apiPharmacy.calle || pharmacie.address;
          pharmacie.hours = horario || pharmacie.hours;
          pharmacie.phone = apiPharmacy.telefonos || pharmacie.phone;

          if (apiPharmacy.geometry && apiPharmacy.geometry.coordinates) {
            pharmacie.longitude = apiPharmacy.geometry.coordinates[0];
            pharmacie.latitude = apiPharmacy.geometry.coordinates[1];
          }

          console.log(`Actualizada farmacia: ${pharmacie.name}`);
        }

        pharmacie.guard_date = guardDate;

        const savedPharmacie = await this.pharmacieRepository.save(pharmacie);
        syncedPharmacies.push(savedPharmacie);
      }

      console.log(
        `[${new Date().toISOString()}] Sincronización completada: ${syncedPharmacies.length} farmacias guardadas, ${filteredCount} filtradas`,
      );
      return syncedPharmacies;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';

      console.error(
        `[${new Date().toISOString()}] Error al sincronizar con el ayuntamiento:`,
        errorMessage,
      );

      throw new HttpException(
        'Error al sincronizar farmacias del ayuntamiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
