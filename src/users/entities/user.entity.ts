import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}
export class User {
  @IsOptional()
  id: number;

  @ApiProperty({
    example: 'Muhammed',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  firstName: string;

  @ApiProperty({
    example: 'Ismail',
    required: true,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(25)
  lastName: string;

  @ApiProperty({
    example: 'abc.123@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234578910',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'User' })
  role: UserRole;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    type: Date,
    default: new Date(),
  })
  createdDate: Date;

  @ApiProperty({
    type: Date,
    default: new Date(),
  })
  updatedDate: Date;
}
