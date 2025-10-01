import { Controller, Get, Param, Post } from '@nestjs/common';
import { PharmacieService } from '../services/pharmacie.service';

@Controller('pharmacies')
export class PharmacieController {
  constructor(private readonly pharmacieService: PharmacieService) {}

  @Get()
  async getAllPharmacies() {
    return this.pharmacieService.getAllPharmacies();
  }

  @Get('today')
  async getTodayGuardPharmacies() {
    const pharmacies = await this.pharmacieService.getTodayGuardPharmacies();
    return {
      date: new Date().toISOString().split('T')[0],
      count: pharmacies.length,
      pharmacies: pharmacies,
    };
  }

  @Get(':id')
  async getPharmacieById(@Param('id') id: string) {
    return this.pharmacieService.getPharmacieById(id);
  }

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
