export class UserInfoDto{
    id: number;
    email: string;
    createdAt: number;
    hashPwd: string;

    constructor(partial: Partial<UserInfoDto>) {
        Object.assign(this, partial);
      }
}