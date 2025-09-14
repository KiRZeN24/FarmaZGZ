import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PharmacieService } from '../services/pharmacie.service';

@Controller('pharmacies')
export class PharmacieController {
  constructor(private readonly pharmacieService: PharmacieService) {}
  @Get()
  getAllPharmacies() {
    return this.pharmacieService.getAllPharmacies();
  }

  @Get('/:id')
  getPharmacieById(@Param('id', ParseUUIDPipe) id: string) {
    return this.pharmacieService.getPharmacieById(id);
  }
}
