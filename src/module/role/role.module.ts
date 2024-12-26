import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { ResponseUtil } from 'src/util/response.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './repository/role.repository';
import { PermissionModule } from '../permission/permission.module';
import { RolePermissionRepository } from './repository/role-permission.repository';
import { RolePermission } from './entities/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission]), PermissionModule],
  controllers: [RoleController],
  providers: [
    RoleRepository,
    RoleService,
    RolePermissionRepository,
    ResponseUtil,
  ],
  exports: [RoleRepository],
})
export class RoleModule {}
