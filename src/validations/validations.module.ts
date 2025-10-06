import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Validation } from './models/validation.model';
import { ValidationService } from './services/validation.service';
import { ValidationController } from './controllers/validation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Validation])],
  controllers: [ValidationController],
  providers: [ValidationService],
  exports: [ValidationService],
})
export class ValidationsModule {}
