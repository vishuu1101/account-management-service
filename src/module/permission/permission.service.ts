import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './repository/permission.repository';
import { CreatePermissionRequestDTO } from './dto/create-permission-request.dto';
import { CreatePermissionResponseDTO } from './dto/create-permission-response.dto';
import { plainToInstance } from 'class-transformer';
import { PermissionInfoResponseDTO } from './dto/permission-info-response.dto';
import { ListPermissionRequestDTO } from './dto/list-permission-request.dto';
import { ListPermissionResponseDTO } from './dto/list-permission-response.dto';
import { PermissionDTO } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(
    permissionDTO: CreatePermissionRequestDTO,
  ): Promise<CreatePermissionResponseDTO> {
    const permissFromDB =
      await this.permissionRepository.createPermission(permissionDTO);
    return plainToInstance(CreatePermissionResponseDTO, permissFromDB, {
      excludeExtraneousValues: true,
    });
  }

  async getPermissionInfo(id: number): Promise<PermissionInfoResponseDTO> {
    const permissFromDB = await this.permissionRepository.getPermissionById(id);
    return plainToInstance(PermissionInfoResponseDTO, permissFromDB, {
      excludeExtraneousValues: true,
    });
  }

  async getAllPermissionsWithSearchCriteria(
    requestDTO: ListPermissionRequestDTO,
  ): Promise<ListPermissionResponseDTO> {
    const skipCount = (requestDTO.page - 1) * requestDTO.limit;
    const [entities, totalCount] = await this.permissionRepository.list(
      {
        label: requestDTO.label,
        sortOrder: requestDTO.sortOrder,
        sortColumn: requestDTO.sortColumn,
      },
      requestDTO.limit,
      skipCount,
    );
    return plainToInstance(ListPermissionResponseDTO, {
      permissionList: plainToInstance(PermissionDTO, entities, {
        excludeExtraneousValues: true,
      }),
      totalCount: totalCount,
      page: requestDTO.page,
      limit: requestDTO.limit,
    });
  }
}
