import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  username: string;

  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(1, { message: 'La contraseña no puede estar vacía' })
  password: string;
}
