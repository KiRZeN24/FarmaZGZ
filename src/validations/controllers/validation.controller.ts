import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ValidationService } from '../services/validation.service';
import { CreateValidationDto } from '../dtos/create-validation.dto';

@Controller('validations')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post()
  async createValidation(
    @Body() dto: CreateValidationDto & { userId: string },
  ) {
    return this.validationService.createValidation(dto.userId, dto);
  }

  @Get('pharmacy/:pharmacyId')
  async getPharmacyValidations(@Param('pharmacyId') pharmacyId: string) {
    return this.validationService.getPharmacyValidations(pharmacyId);
  }

  @Get('user/:userId')
  async getUserValidations(@Param('userId') userId: string) {
    return this.validationService.getUserValidations(userId);
  }
}
