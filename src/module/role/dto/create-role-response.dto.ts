import { Expose } from 'class-transformer';

export class CreateRoleResponseDTO {
  @Expose()
  name: string;
}
