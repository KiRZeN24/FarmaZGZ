import { Controller, Get, Param, Post } from '@nestjs/common';
import { PharmacieService } from '../services/pharmacie.service';

@Controller('pharmacies')
export class PharmacieController {
  constructor(private readonly pharmacieService: PharmacieService) {}

  @Get()
  async getAllPharmacies() {
    return this.pharmacieService.getAllPharmacies();
  }

  @Get(':id')
  async getPharmacieById(@Param('id') id: string) {
    return this.pharmacieService.getPharmacieById(id);
  }

  //Sincronizar con API del ayuntamiento
  @Post('sync')
  async syncWithAyuntamiento() {
    const pharmacies = await this.pharmacieService.syncWithAyuntamiento();
    return {
      message: 'Sincronización completada',
      count: pharmacies.length,
      pharmacies: pharmacies,
    };
  }
}
