import { Module } from '@nestjs/common';
import { PharmacieController } from './controllers/pharmacie.controller';
import { PharmacieService } from './services/pharmacie.service';

@Module({
  controllers: [PharmacieController],
  providers: [PharmacieService],
})
export class PharmaciesModule {}
