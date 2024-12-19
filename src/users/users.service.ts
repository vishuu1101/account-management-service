import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

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
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException(
        `User already registerd with EmailId:${createUserDto.email}`,
      );
    }

    const newUser = new UsersEntity();
    newUser.email = createUserDto.email;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    //hash user password before saving to DB
    const hashedPwd = bcrypt.hashSync(createUserDto.password, 10);

    newUser.password = hashedPwd;
    const user = this.userRepository.create(newUser);
    const dbUser = await this.userRepository.save(user);
    return new UserInfoDto({
      id: dbUser.id,
      createdAt: dbUser.createdAt.getTime(),
      email: dbUser.email,
    });
  }

  async findAll(): Promise<UserInfoDto[]> {
    const users = await this.userRepository.find();
    // Map the data to UserDto
    return users.map(
      (user) =>
        new UserInfoDto({
          id: user.id,
          createdAt: user.createdAt.getTime(),
          email: user.email,
        }),
    );
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

  async isValidUser(email: string): Promise<UsersEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(
        `User with EmailId:${email} is not available`,
      );
    } else {
      return user;
    }
  }
}
