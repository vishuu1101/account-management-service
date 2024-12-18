import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoDto } from './dto/user-info.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UsersEntity) private readonly userRepository: Repository<UsersEntity>,) {
    }

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if(existingUser){
      throw new BadRequestException(`User already registerd with EmailId:${createUserDto.email}`)
    }

    const newUser = new UsersEntity();
    newUser.email = createUserDto.email;

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

  async findAll(): Promise<UserInfoDto[]>{
    const users = await this.userRepository.find();
    // Map the data to UserDto
    return users.map(user => new UserInfoDto({
      id: user.id,
      createdAt: user.createdAt.getTime(),
      email: user.email,
    }));
  }
}
