import { Injectable, NotFoundException } from '@nestjs/common';
import { Pharmacie } from '../models/pharmacie.model';

@Injectable()
export class PharmacieService {
  db: Pharmacie[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Farmacia Central',
      address: 'Calle Mayor, 1',
      hours: '24 horas',
      phone: '123456789',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Farmacia San Pablo',
      address: 'Avenida César Augusto, 456',
      hours: '9:00 - 22:00',
      phone: '976654321',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Farmacia del Pilar',
      address: 'Plaza del Pilar, 12',
      hours: '8:00 - 21:00',
      phone: '976111222',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Farmacia Delicias',
      address: 'Calle Delicias, 89',
      hours: '9:30 - 21:30',
      phone: '976333444',
    },
  ];
  getAllPharmacies(): Pharmacie[] {
    return this.db;
  }
  getPharmacieById(id: string): Pharmacie {
    const pharmacie = this.db.find((pharmacie) => pharmacie.id === id);

    if (!pharmacie) {
      throw new NotFoundException(`Farmacia con ID ${id} no encontrada`);
    }
    return pharmacie;
  }
}
