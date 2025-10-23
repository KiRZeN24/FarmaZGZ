import { IsBoolean, IsUUID, IsDateString } from 'class-validator';

export class CreateValidationDto {
  @IsUUID()
  pharmacyId: string;

  @IsBoolean()
  isValid: boolean;

  @IsDateString()
  guardDate: string;
}
