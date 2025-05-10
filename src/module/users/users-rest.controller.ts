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
import { NotEmptyPipe } from '../../util/pipes/not-empty.pipe';
import { ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ListUserRequestDTO } from './dto/list-user-request.dto';
import { ResponseDTO } from 'src/dto/response.dto';
import { ListUserResponseDTO } from './dto/list-user-response.dto';
import { ResponseUtil } from 'src/util/response.util';

@ApiTags('Users')
@Controller('users')
export class UsersRestController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Get('getByEmail')
  async getUserInfoRest(
    @Query('email', NotEmptyPipe) emailId: string,
  ): Promise<ResponseDTO<UserInfoDto>> {
    const response = await this.usersService.getUserInfo(emailId);
    return this.responseUtil.successResponse(0, response);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserRequestDTO,
    description: 'Json structure for user object',
  })
  async create(@Body(ValidationPipe) createUserDto: CreateUserRequestDTO) {
    const response = await this.usersService.create(createUserDto);
    return this.responseUtil.successResponse(0, response);
  }

  @Get('/getAllUsers')
  async getUserList(
    @Query() requestDTO: ListUserRequestDTO,
  ): Promise<ResponseDTO<ListUserResponseDTO>> {
    const responseDTO =
      await this.usersService.getAllUsersWithSearchCriteria(requestDTO);
    return this.responseUtil.successResponse(0, responseDTO);
  }

  @Post('updateUser')
  @ApiBody({
    type: UpdateUserRequestDto,
    description: 'Json structure for user object',
  })
  async updateUser(
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<ResponseDTO<UpdateUserResponseDto>> {
    const response = await this.usersService.updateUser(updateUserDto);
    return this.responseUtil.successResponse(0, response);
  }
}
