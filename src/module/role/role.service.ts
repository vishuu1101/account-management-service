import { Injectable } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { CreateRoleRequestDTO } from './dto/create-role-request.dto';
import { CreateRoleResponseDTO } from './dto/create-role-response.dto';
import { plainToInstance } from 'class-transformer';
import { PermissionRepository } from '../permission/repository/permission.repository';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionRepository } from './repository/role-permission.repository';
import { RoleInfoResponseDTO } from './dto/role-info-response.dto';
import { ListRoleRequestDTO } from './dto/list-role-request.dto';
import { ListRoleResponseDTO } from './dto/list-role-response.dto';
import { RoleDTO } from './dto/role.dto';
import { UserBasicInfoDTO } from '../users/dto/user-basic-info.dto';
import { PermissionDTO } from '../permission/dto/permission.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async create(roleDTO: CreateRoleRequestDTO): Promise<CreateRoleResponseDTO> {
    const permissions = await this.permissionRepository.getPermissionsByIds(
      roleDTO.permissionIds,
    );
    roleDTO.permissions = permissions;

    const roleFromDB = await this.roleRepository.createRole(roleDTO);

    const rolePermissions = roleDTO.permissions.map((permission) => {
      const rolePermission = new RolePermission();
      rolePermission.role = roleFromDB;
      rolePermission.permission = permission;
      return rolePermission;
    });

    const rolePermissionsFromDB =
      await this.rolePermissionRepository.saveAll(rolePermissions);
    roleFromDB.rolePermissions = rolePermissionsFromDB;
    return plainToInstance(CreateRoleResponseDTO, roleFromDB, {
      excludeExtraneousValues: true,
    });
  }

  async getRoleInfo(id: number): Promise<RoleInfoResponseDTO> {
    const roleFromDB = await this.roleRepository.getRoleById(id);

    const users = roleFromDB.userRoles.map((userRole) => {
      return plainToInstance(UserBasicInfoDTO, userRole.user, {
        excludeExtraneousValues: true,
      });
    });

    const permissions = roleFromDB.rolePermissions.map((rolePermission) => {
      return plainToInstance(PermissionDTO, rolePermission.permission, {
        excludeExtraneousValues: true,
      });
    });

    return plainToInstance(
      RoleInfoResponseDTO,
      { ...roleFromDB, users, permissions },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getAllRolesWithSearchCriteria(
    requestDTO: ListRoleRequestDTO,
  ): Promise<ListRoleResponseDTO> {
    const skipCount = (requestDTO.page - 1) * requestDTO.limit;
    const [entities, totalCount] = await this.roleRepository.list(
      {
        name: requestDTO.name,
        sortOrder: requestDTO.sortOrder,
        sortColumn: requestDTO.sortColumn,
      },
      requestDTO.limit,
      skipCount,
    );
    return plainToInstance(ListRoleResponseDTO, {
      roleList: plainToInstance(RoleDTO, entities, {
        excludeExtraneousValues: true,
      }),
      totalCount: totalCount,
      page: requestDTO.page,
      limit: requestDTO.limit,
    });
  }
}
