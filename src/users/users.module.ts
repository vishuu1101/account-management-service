import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersMicroserviceController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  providers: [UsersService],
  controllers: [UsersMicroserviceController],
})
export class UsersModule {}
