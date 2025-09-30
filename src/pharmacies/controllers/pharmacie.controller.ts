import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PharmacieService } from '../services/pharmacie.service';

@Controller('pharmacies')
export class PharmacieController {
  constructor(private readonly pharmacieService: PharmacieService) {}
  @Get()
  async getAllPharmacies() {
    return this.pharmacieService.getAllPharmacies();
  }

  @Get('/:id')
  async getPharmacieById(@Param('id', ParseUUIDPipe) id: string) {
    return this.pharmacieService.getPharmacieById(id);
  }

  // Endpoint temporal para insertar datos iniciales
  @Get('seed/initial')
  async seedData() {
    await this.pharmacieService.seedInitialData();
    return { message: 'Datos insertados correctamente' };
  }
}
