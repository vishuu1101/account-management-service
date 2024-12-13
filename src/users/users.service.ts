import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { isNotEmptyObject } from 'class-validator';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const newUser = new User();
    newUser.id = this.users.length + 1;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.role = createUserDto.role;
    if (this.IsUserExists(createUserDto.email)) {
      this.users.push(newUser);
    } else {
      return { Error: 'Record already exists.' };
    }
    return this.getUserById(newUser.id)[0];
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.getUserById(id)[0];
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const [targetUser, idx] = this.getUserById(id);
    const modifiedUser = new User();
    modifiedUser.id = id;
    modifiedUser.email = targetUser.email;
    modifiedUser.password = updateUserDto.password
      ? updateUserDto.password
      : targetUser.password;
    modifiedUser.firstName = updateUserDto.firstName
      ? updateUserDto.firstName
      : targetUser.firstName;
    modifiedUser.lastName = updateUserDto.lastName
      ? updateUserDto.lastName
      : targetUser.lastName;
    modifiedUser.role = updateUserDto.role
      ? updateUserDto.role
      : targetUser.role;
    modifiedUser.isActive = updateUserDto.isActive
      ? updateUserDto.isActive
      : targetUser.isActive;
    this.users[idx] = modifiedUser;

    return this.users[idx];
  }

  deactivate(id: number) {
    const [targetUser, idx] = this.getUserById(id);
    targetUser.isActive = false;
    this.users[idx] = targetUser;
    return this.users[idx];
  }
  private getUserById(id: number): [User, number] {
    const index = this.users.findIndex((u) => u.id == id);
    return [this.users[index], index];
  }

  private getUserByEmail(email: string): [User, string] {
    const index = this.users.findIndex((u) => u.email == email);
    return [this.users[index], email];
  }

  private IsUserExists(email: string): boolean {
    const [targetUser, existing_email] = this.getUserByEmail(email);
    if (isNotEmptyObject(targetUser)) {
      console.log("User '" + existing_email + "' already exists");
      return false;
    }
    return true;
  }
}
