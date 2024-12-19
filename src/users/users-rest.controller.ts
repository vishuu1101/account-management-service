import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UserInfoDto } from './dto/user-info.dto';
import { UsersService } from './users.service';
import { NotEmptyPipe } from './util/pipes/not-empty.pipe';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@Controller('users')
export class UsersRestController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getByEmail')
  getUserInfoRest(
    @Query('email', NotEmptyPipe) emailId: string,
  ): Promise<UserInfoDto> {
    return this.usersService.getUserInfo(emailId);
  }

  @Post()
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
  findAll() {
    return this.usersService.findAll();
  }

  @Post('updateUser')
  @ApiBody({
    type: UpdateUserRequestDto,
    description: 'Json structure for user object',
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return await this.usersService.updateUser(updateUserDto);
  }
}
