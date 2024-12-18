export class UserInfoDto{
    id: number;
    email: string;
    createdAt: number;

    constructor(partial: Partial<UserInfoDto>) {
        Object.assign(this, partial);
      }
}