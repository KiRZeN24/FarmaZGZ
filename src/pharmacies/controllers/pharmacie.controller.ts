import { Controller, Get } from '@nestjs/common';

@Controller('pharmacies')
export class PharmacieController {
  @Get()
  getAllPharmacies() {}

  @Get('/:id')
  getPharmacieById() {}
}
