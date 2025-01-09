import { Permission } from '../entities/permission.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreatePermissionRequestDTO } from '../dto/create-permission-request.dto';

export class PermissionRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async createPermission(
    permission: Partial<CreatePermissionRequestDTO>,
  ): Promise<Permission> {
    const existingPermission = await this.repository.findOne({
      where: { name: permission.name },
    });

    if (existingPermission) {
      throw new HttpException(
        `Permission with name '${permission.name}' already exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.repository.save(
      this.repository.create({
        ...permission,
      }),
    );
  }

  async list(
    filters: { label?: string; sortColumn: string; sortOrder },
    maxResultCount: number = 10,
    skipCount: number = 0,
  ) {
    const queryBuilder = this.repository.createQueryBuilder('permission');

    if (filters.label) {
      queryBuilder.andWhere('permission.label LIKE :label', {
        label: `%${filters.label}%`,
      });
    }

    queryBuilder.orderBy(`permission.${filters.sortColumn}`, filters.sortOrder);
    queryBuilder.offset(skipCount);
    queryBuilder.limit(maxResultCount);
    const [entities] = await queryBuilder.getManyAndCount();
    const transformedEntities = entities.map((item) => ({
      ...item,
      id: Number(item.id),
    }));
    return transformedEntities;
  }

  async getPermissionById(id: number) {
    const permission = await this.repository.findOne({
      where: { id: id },
    });

    if (!permission) {
      throw new HttpException(
        `No permission exist with identifier:${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    permission.id = Number(permission.id)
    return permission;
  }

  async getPermissionsByIds(ids: number[]) {
    const entities = await this.repository.find({
      where: { id: In(ids) },
    });
    const transformedEntities = entities.map((item) => ({
      ...item,
      id: Number(item.id),
    }));
    return transformedEntities;
  }
}
