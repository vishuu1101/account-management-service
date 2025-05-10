import { Expose } from 'class-transformer';
import { PermissionDTO } from './permission.dto';

export class ListPermissionResponseDTO {
  @Expose()
  permissionList: PermissionDTO[];

  @Expose()
  totalCount: number;

  @Expose()
  page?: number;

  @Expose()
  limit?: number;
}
