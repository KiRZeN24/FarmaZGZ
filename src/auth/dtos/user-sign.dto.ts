import { IsString, IsStrongPassword } from 'class-validator';

export class userSignDto {
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
}
