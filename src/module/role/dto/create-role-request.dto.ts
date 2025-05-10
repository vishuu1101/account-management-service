import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Permission } from 'src/module/permission/entities/permission.entity';
import { User } from 'src/module/users/entities/users.entity';

export class CreateRoleRequestDTO {
  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  permissionIds: number[];

  @ApiHideProperty()
  userList: User[] = [];

  @Exclude()
  @ApiHideProperty()
  permissions?: Permission[];
}
