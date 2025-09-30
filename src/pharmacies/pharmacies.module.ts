import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacieController } from './controllers/pharmacie.controller';
import { PharmacieService } from './services/pharmacie.service';
import { Pharmacie } from './models/pharmacie.model';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacie])],
  controllers: [PharmacieController],
  providers: [PharmacieService],
  exports: [PharmacieService],
})
export class PharmaciesModule {}
