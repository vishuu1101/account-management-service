import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotEmptyPipe } from 'src/util/pipes/not-empty.pipe';

@Controller('/user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @MessagePattern()
  @ApiResponse({
    status: 201,
    description: 'User record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('getAllUsers')
  @MessagePattern('findAllUsers')
  findAll() {
    return this.usersService.findAll();
  }

  @Get("get-user")
  @MessagePattern('get-user')
  getUserInfo(@Query('emailId', NotEmptyPipe) emailId: string) {
    return this.usersService.getUserInfo(emailId);
  }
}
