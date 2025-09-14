import { Module } from '@nestjs/common';
import { PharmacieController } from './controllers/pharmacie.controller';

@Module({
  controllers: [PharmacieController],
  providers: [],
})
export class PharmaciesModule {}
