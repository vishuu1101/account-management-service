import {
  IsNumber,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from 'class-validator';
import { User, UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  password_salt: string;

  role: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  createdDate: Date;
  updatedDate: Date;

  static fromUser(user: User) {
    const dto = new CreateUserDto();
    dto.id = user.id;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.email = user.email;
    dto.password = user.password;
    dto.role = user.role;

    return dto;
  }

  static toUser(dto: CreateUserDto) {
    const user = new User();
    user.id = dto.id;
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.password = dto.password;
    user.role = dto.role;

    return user;
  }
}
