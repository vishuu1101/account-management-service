import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMicroserviceController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { UsersRestController } from './users-rest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersService],
  controllers: [UsersMicroserviceController, UsersRestController],
})
export class UsersModule {}
