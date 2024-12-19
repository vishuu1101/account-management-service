import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cth7n51opnds73b00b2g-a',
      port: 5432,
      password: 'Xh40iyQNs5WDBYYPIuL44BEaGGNMlAIh',
      username: 'postgress',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: 'postgress_1g7m',
      synchronize: true,
      logging: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
