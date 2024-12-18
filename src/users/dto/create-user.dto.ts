import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;
}
