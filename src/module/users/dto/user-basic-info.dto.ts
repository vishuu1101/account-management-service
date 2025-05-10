import { Expose } from 'class-transformer';

export class UserBasicInfoDTO {
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  email: string;
}
