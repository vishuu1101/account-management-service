import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UpdateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
