import { Expose } from 'class-transformer';
import { RoleDTO } from './role.dto';

export class ListRoleResponseDTO {
  @Expose()
  roleList: RoleDTO[];

  @Expose()
  totalCount: number;

  @Expose()
  page?: number;

  @Expose()
  limit?: number;
}
