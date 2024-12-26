import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Controller()
export class UsersMicroserviceController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'getUserInfo' })
  getUserInfo(emailId: string): Promise<UserInfoDto> {
    return this.usersService.getUserInfo(emailId);
  }

  @MessagePattern({ cmd: 'createUser' })
  create(@Body() createUserDto: CreateUserRequestDTO) {
    return this.usersService.create(createUserDto);
  }
}
