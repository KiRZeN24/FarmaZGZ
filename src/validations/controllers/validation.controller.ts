import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { ValidationService } from '../services/validation.service';
import { CreateValidationDto } from '../dtos/create-validation.dto';
import { JwtPayload } from '../../auth/interfaces/auth.interface';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/models/user.model';

@Controller('validations')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post()
  async createValidation(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: CreateValidationDto,
  ) {
    const userId = req.user.id;
    return this.validationService.createValidation(userId, dto);
  }

  @Get('pharmacy/:pharmacyId')
  async getPharmacyValidations(@Param('pharmacyId') pharmacyId: string) {
    return this.validationService.getPharmacyValidations(pharmacyId);
  }

  @Roles(UserRole.ADMIN)
  @Get('user/:userId')
  async getUserValidations(@Param('userId') userId: string) {
    return this.validationService.getUserValidations(userId);
  }
}
