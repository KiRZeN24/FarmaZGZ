import { IsOptional, IsString, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../models/user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
