import { Expose } from 'class-transformer';
import { PermissionDTO } from 'src/module/permission/dto/permission.dto';
import { UserBasicInfoDTO } from 'src/module/users/dto/user-basic-info.dto';

export class RoleInfoResponseDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  isActive: boolean;
  @Expose()
  users: UserBasicInfoDTO[];
  @Expose()
  permissions: PermissionDTO[];
}
