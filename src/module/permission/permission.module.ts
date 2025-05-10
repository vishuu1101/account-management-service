import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './repository/permission.repository';
import { ResponseUtil } from 'src/util/response.util';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionRepository, PermissionService, ResponseUtil],
  exports: [PermissionRepository],
})
export class PermissionModule {}
