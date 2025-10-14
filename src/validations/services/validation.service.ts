import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Validation } from '../models/validation.model';
import { CreateValidationDto } from '../dtos/create-validation.dto';
import { ValidationOutputDto } from '../dtos/validation-output.dto';

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(Validation)
    private readonly validationRepository: Repository<Validation>,
  ) {}

  async createValidation(
    userId: string,
    dto: CreateValidationDto,
  ): Promise<ValidationOutputDto> {
    const existingValidation = await this.validationRepository.findOne({
      where: {
        userId,
        pharmacyId: dto.pharmacyId,
      },
    });

    if (existingValidation) {
      throw new ConflictException('Ya has validado esta farmacia');
    }

    const validation = this.validationRepository.create({
      userId,
      pharmacyId: dto.pharmacyId,
      isValid: dto.isValid,
    });

    await this.validationRepository.save(validation);
    return ValidationOutputDto.fromEntity(validation);
  }

  async getPharmacyValidations(pharmacyId: string) {
    const validations = await this.validationRepository.find({
      where: { pharmacyId },
      relations: ['user'],
    });

    const totalValidations = validations.length;
    const correctValidations = validations.filter((v) => v.isValid).length;
    const incorrectValidations = totalValidations - correctValidations;

    return {
      pharmacyId,
      totalValidations,
      correctValidations,
      incorrectValidations,
      correctPercentage:
        totalValidations > 0
          ? (correctValidations / totalValidations) * 100
          : 0,
      validations: validations.map((v) => ValidationOutputDto.fromEntity(v)),
    };
  }

  async getMyValidations(userId: string) {
    const validations = await this.validationRepository.find({
      where: { userId },
      relations: ['pharmacy'],
      order: { createdAt: 'DESC' },
    });

    // Devolver con pharmacyId explícito para el frontend
    return validations.map((v) => ({
      id: v.id,
      pharmacyId: v.pharmacyId,
      isValid: v.isValid,
      createdAt: v.createdAt,
      pharmacy: {
        id: v.pharmacy.id,
        name: v.pharmacy.name,
        address: v.pharmacy.address,
      },
    }));
  }

  async getUserValidations(userId: string): Promise<ValidationOutputDto[]> {
    const validations = await this.validationRepository.find({
      where: { userId },
      relations: ['pharmacy'],
      order: { createdAt: 'DESC' },
    });

    return validations.map((v) => ValidationOutputDto.fromEntity(v));
  }
}
