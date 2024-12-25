import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { ListUserRequestDTO } from './dto/list-user-request.dto';
import { ListUserResponseDTO } from './dto/list-user-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserRepository } from './repository/user.repository';
import { UserBasicInfoDTO } from './dto/user-basic-info.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(emailId: string): Promise<UserInfoDto> {
    const user = await this.isValidUser(emailId);
    return new UserInfoDto({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hashPwd: user.password,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException(
        `User already registerd with EmailId:${createUserDto.email}`,
      );
    }

    //hash user password before saving to DB
    const hashedPwd = bcrypt.hashSync(createUserDto.password, 10);

    const { id, createdDate, email } = await this.userRepository.saveUser(
      createUserDto,
      hashedPwd,
    );
    return new UserInfoDto({
      id,
      createdAt: createdDate.getTime(),
      email,
    });
  }

  async updateUser(
    updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.isValidUser(updateUserRequestDto.email);
    user.firstName = updateUserRequestDto.firstName;
    user.lastName = updateUserRequestDto.lastName;

    const dbUser = await this.userRepository.save(user);
    return new UpdateUserResponseDto({
      id: dbUser.id,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
    });
  }

  async isValidUser(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        `User with EmailId:${email} is not available`,
      );
    } else {
      return user;
    }
  }

  async getAllUsersWithSearchCriteria(
    requestDTO: ListUserRequestDTO,
  ): Promise<ListUserResponseDTO> {
    const skipCount = (requestDTO.page - 1) * requestDTO.limit;
    const [entities, totalCount] = await this.userRepository.list(
      {
        name: requestDTO.name,
        sortOrder: requestDTO.sortOrder,
        sortColumn: requestDTO.sortColumn,
      },
      requestDTO.limit,
      skipCount,
    );
    return plainToInstance(ListUserResponseDTO, {
      userList: plainToInstance(UserBasicInfoDTO, entities, {
        excludeExtraneousValues: true,
      }),
      totalCount: totalCount,
      page: requestDTO.page,
      limit: requestDTO.limit,
    });
  }
}
