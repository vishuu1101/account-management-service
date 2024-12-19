export class UserInfoDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: number;
  hashPwd: string;

  constructor(partial: Partial<UserInfoDto>) {
    Object.assign(this, partial);
  }
}
