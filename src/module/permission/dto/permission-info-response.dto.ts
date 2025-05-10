import { Expose } from 'class-transformer';

export class PermissionInfoResponseDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  label: string;
}
