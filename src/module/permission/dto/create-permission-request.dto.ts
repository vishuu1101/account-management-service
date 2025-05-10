import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionRequestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  label: string;
}
