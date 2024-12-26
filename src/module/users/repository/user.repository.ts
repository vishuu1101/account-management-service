import { ILike, Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email: ILike(email) },
    });
  }

  async saveOrupdate(user: User) {
    return await this.userRepository.save(user);
  }

  list(
    filters: { name?: string; sortColumn: string; sortOrder },
    maxResultCount: number = 10,
    skipCount: number = 0,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters.name) {
      queryBuilder.andWhere('user.firstName LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    queryBuilder.orderBy(`user.${filters.sortColumn}`, filters.sortOrder);
    queryBuilder.offset(skipCount);
    queryBuilder.limit(maxResultCount);
    return queryBuilder.getManyAndCount();
  }
}
