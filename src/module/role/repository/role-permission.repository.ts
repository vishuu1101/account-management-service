import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';

export class RolePermissionRepository {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async saveAll(rolePermissions: RolePermission[]): Promise<RolePermission[]> {
    return await this.rolePermissionRepository.save(rolePermissions);
  }
}
