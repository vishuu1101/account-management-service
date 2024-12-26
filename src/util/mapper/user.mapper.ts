import { CreateUserRequestDTO } from '../../module/users/dto/create-user-request.dto';
import { User } from '../../module/users/entities/users.entity';

export function mapDtoToEntity(dto: CreateUserRequestDTO): User {
  const user = new User();
  user.firstName = dto.firstName;
  user.lastName = dto.lastName;
  user.email = dto.email.toLowerCase();
  user.password = dto.password;
  return user;
}
