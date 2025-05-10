import { Expose } from 'class-transformer';

export class CreatePermissionResponseDTO {
  @Expose()
  name: string;
  @Expose()
  label: string;
}
