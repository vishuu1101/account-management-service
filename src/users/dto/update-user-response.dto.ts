export class UpdateUserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;

  constructor(partial: Partial<UpdateUserResponseDto>) {
    Object.assign(this, partial);
  }
}
