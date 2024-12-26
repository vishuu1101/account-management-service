import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsStrongPassword,
  IsString,
  ArrayNotEmpty,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateUserRequestDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
