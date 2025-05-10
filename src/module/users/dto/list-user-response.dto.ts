import { Expose } from 'class-transformer';
import { UserBasicInfoDTO } from './user-basic-info.dto';

export class ListUserResponseDTO {
  @Expose()
  userList: UserBasicInfoDTO[];

  @Expose()
  totalCount: number;

  @Expose()
  page?: number;

  @Expose()
  limit?: number;
}
