import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMicroserviceController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UsersRestController } from './users-rest.controller';
import { UserRepository } from './repository/user.repository';
import { ResponseUtil } from 'src/util/response.util';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  providers: [UsersService, UserRepository, ResponseUtil],
  controllers: [UsersMicroserviceController, UsersRestController],
})
export class UsersModule {}
