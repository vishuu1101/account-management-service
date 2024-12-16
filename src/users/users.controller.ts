import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('/user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  @MessagePattern('createUser')
  @ApiResponse({
    status: 201,
    description: 'User record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: User,
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
  @Get('getUserById:id')
  @MessagePattern('findOneUser')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
  @Put('updateUser:id')
  @MessagePattern('updateUser')
  update(@Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }
  @Put('deactivateUser')
  @MessagePattern('deactivateUser')
  deactivate(@Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.deactivate(updateUserDto.id);
  }

  /*   @Patch("/change-password/:id")
  async changePassword(
    @Param("id") id,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  } */
}
