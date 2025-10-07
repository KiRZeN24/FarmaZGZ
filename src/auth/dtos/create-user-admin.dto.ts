import {
  IsString,
  IsStrongPassword,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../models/user.model';

export class CreateUserAdminDto {
  @IsString()
  username: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
