import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { CreateRoleRequestDTO } from '../dto/create-role-request.dto';

export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(roleRequest: Partial<CreateRoleRequestDTO>): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: roleRequest.roleName },
    });

    if (existingRole) {
      throw new HttpException(
        `Role with name '${roleRequest.roleName}' already exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const savedRole = this.roleRepository.save(
      this.roleRepository.create({
        name: roleRequest.roleName,
        isActive: true,
      }),
    );

    return savedRole;
  }

  list(
    filters: { name?: string; sortColumn: string; sortOrder },
    maxResultCount: number = 10,
    skipCount: number = 0,
  ) {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');

    if (filters.name) {
      queryBuilder.andWhere('role.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    queryBuilder.orderBy(`role.${filters.sortColumn}`, filters.sortOrder);
    queryBuilder.offset(skipCount);
    queryBuilder.limit(maxResultCount);
    return queryBuilder.getManyAndCount();
  }

  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id: id },
      relations: ['rolePermissions.permission', 'userRoles.user'],
    });

    if (!role) {
      throw new HttpException(
        `No role exist with identifier:${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return role;
  }
}
