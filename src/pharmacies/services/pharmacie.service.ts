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
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class PharmacieService {
  constructor(
    @InjectRepository(Pharmacie)
    private readonly pharmacieRepository: Repository<Pharmacie>,
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

  //Sincronizar con API del Ayuntamiento
  async syncWithAyuntamiento(): Promise<Pharmacie[]> {
    const today = new Date();
    const formattedDate = today
      .toISOString()
      .split('T')[0]
      .split('-')
      .reverse()
      .join('-'); // DD-MM-YYYY

    const apiUrl = `http://www.zaragoza.es/sede/servicio/farmacia.json?tipo=guardia&fecha=${formattedDate}`;

    try {
      console.log(`🏛️ Sincronizando farmacias del ${formattedDate}...`);

      const response: AxiosResponse<AyuntamientoApiResponse> =
        await axios.get(apiUrl);

      const apiPharmacies: AyuntamientoPharmacy[] = response.data.result;

      console.log(`📡 Recibidas ${apiPharmacies.length} farmacias de la API`);

      if (apiPharmacies.length === 0) {
        console.log('⚠️  No hay farmacias de guardia para esta fecha');
        return [];
      }

      const syncedPharmacies: Pharmacie[] = [];

      for (const apiPharmacy of apiPharmacies) {
        // Buscar si ya existe por external_id
        let pharmacie = await this.pharmacieRepository.findOne({
          where: { external_id: apiPharmacy.id.toString() },
        });

        if (!pharmacie) {
          // Crear nueva farmacia
          pharmacie = new Pharmacie();
          pharmacie.external_id = apiPharmacy.id.toString();
          pharmacie.name = apiPharmacy.title || 'Farmacia sin nombre';
          pharmacie.address = apiPharmacy.calle || 'Dirección no disponible';
          pharmacie.hours = apiPharmacy.guardia.horario || 'Consultar horario';
          pharmacie.phone = apiPharmacy.telefonos || 'No disponible';

          //Coordenadas vienen en geometry.coordinates [lng, lat]
          if (apiPharmacy.geometry && apiPharmacy.geometry.coordinates) {
            pharmacie.longitude = apiPharmacy.geometry.coordinates[0]; // Longitud (X)
            pharmacie.latitude = apiPharmacy.geometry.coordinates[1]; // Latitud (Y)
          } else {
            pharmacie.latitude = null;
            pharmacie.longitude = null;
          }

          console.log(`✨ Nueva farmacia: ${pharmacie.name}`);
        } else {
          // Actualizar datos existentes
          pharmacie.name = apiPharmacy.title || pharmacie.name;
          pharmacie.address = apiPharmacy.calle || pharmacie.address;
          pharmacie.hours = apiPharmacy.guardia.horario || pharmacie.hours;
          pharmacie.phone = apiPharmacy.telefonos || pharmacie.phone;

          if (apiPharmacy.geometry && apiPharmacy.geometry.coordinates) {
            pharmacie.longitude = apiPharmacy.geometry.coordinates[0];
            pharmacie.latitude = apiPharmacy.geometry.coordinates[1];
          }

          console.log(`🔄 Actualizada farmacia: ${pharmacie.name}`);
        }

        const savedPharmacie = await this.pharmacieRepository.save(pharmacie);
        syncedPharmacies.push(savedPharmacie);
      }

      console.log(
        `Sincronización completada: ${syncedPharmacies.length} farmacias`,
      );
      return syncedPharmacies;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al sincronizar con el ayuntamiento:', errorMessage);

      throw new HttpException(
        'Error al sincronizar farmacias del ayuntamiento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
