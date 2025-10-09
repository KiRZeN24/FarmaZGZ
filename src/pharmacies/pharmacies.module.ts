import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacieController } from './controllers/pharmacie.controller';
import { PharmacieService } from './services/pharmacie.service';
import { Pharmacie } from './models/pharmacie.model';
import { SchedulerService } from './services/scheduler.service';
import { Validation } from '../validations/models/validation.model';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacie, Validation])],
  controllers: [PharmacieController],
  providers: [PharmacieService, SchedulerService],
  exports: [PharmacieService],
})
export class PharmaciesModule {}
