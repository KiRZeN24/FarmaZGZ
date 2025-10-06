import { Validation } from '../models/validation.model';

export class ValidationOutputDto {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly pharmacyId: string,
    readonly isValid: boolean,
    readonly createdAt: Date,
  ) {}

  static fromEntity(validation: Validation): ValidationOutputDto {
    return new ValidationOutputDto(
      validation.id,
      validation.userId,
      validation.pharmacyId,
      validation.isValid,
      validation.createdAt,
    );
  }
}
