import { Expose } from 'class-transformer';

export class PermissionDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  label: string;
}
