import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserRequestDTO } from './dto/create-user-request.dto';
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
import { RoleRepository } from '../role/repository/role.repository';
import { UserRole } from './entities/user-role.entity';
import { mapDtoToEntity } from '../../util/mapper/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
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

  async create(createUserDto: CreateUserRequestDTO) {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException(
        `User already registerd with EmailId:${createUserDto.email}`,
      );
    }

    //validate if all the roleIds are available in db
    const roles = await this.roleRepository.getRolesByIds(
      createUserDto.roleIds,
    );
    if (createUserDto.roleIds.length > (await roles).length) {
      throw new BadRequestException(
        `Invalid RolesIds were passed to create User`,
      );
    }

    //hash user password before saving to DB
    const hashedPwd = bcrypt.hashSync(createUserDto.password, 10);

    const userToSave = mapDtoToEntity(createUserDto);
    userToSave.password = hashedPwd;
    const userRoles = roles.map((roleFromDB) => {
      const userRole = new UserRole();
      userRole.user = userToSave;
      userRole.role = roleFromDB;
      return userRole;
    });
    userToSave.userRoles = userRoles;

    const { id, createdDate, email } =
      await this.userRepository.saveOrupdate(userToSave);
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

    const dbUser = await this.userRepository.saveOrupdate(user);
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
