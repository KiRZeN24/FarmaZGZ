import { IsBoolean, IsUUID } from 'class-validator';

export class CreateValidationDto {
  @IsUUID()
  pharmacyId: string;

  @IsBoolean()
  isValid: boolean;
}
