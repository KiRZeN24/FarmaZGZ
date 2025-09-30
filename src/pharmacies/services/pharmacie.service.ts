import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacie } from '../models/pharmacie.model';

@Injectable()
export class PharmacieService {
  constructor(
    @InjectRepository(Pharmacie)
    private pharmacieRepository: Repository<Pharmacie>,
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

  // Método para insertar datos iniciales (una sola vez)
  async seedInitialData(): Promise<void> {
    const count = await this.pharmacieRepository.count();

    if (count === 0) {
      const initialData = [
        {
          name: 'Farmacia Central',
          address: 'Calle Mayor, 1',
          hours: '24 horas',
          phone: '123456789',
        },
        {
          name: 'Farmacia San Pablo',
          address: 'Avenida César Augusto, 456',
          hours: '9:00 - 22:00',
          phone: '976654321',
        },
        {
          name: 'Farmacia del Pilar',
          address: 'Plaza del Pilar, 12',
          hours: '8:00 - 21:00',
          phone: '976111222',
        },
        {
          name: 'Farmacia Delicias',
          address: 'Calle Delicias, 89',
          hours: '9:30 - 21:30',
          phone: '976333444',
        },
      ];

      for (const data of initialData) {
        const pharmacie = this.pharmacieRepository.create(data);
        await this.pharmacieRepository.save(pharmacie);
      }

      console.log('✅ Datos iniciales insertados en la base de datos');
    }
  }
}
