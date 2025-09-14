import { Controller, Get, Param } from '@nestjs/common';

@Controller('pharmacies')
export class PharmacieController {
  @Get()
  getAllPharmacies() {
    console.log('test all pharmacies');
  }

  @Get('/:id')
  getPharmacieById(@Param('id') id: string) {
    console.log(`test pharmacie by id ${id}`);
  }
}
