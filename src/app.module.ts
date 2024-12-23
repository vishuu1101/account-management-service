import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        password: configService.get<string>('DB_PASSWORD'),
        username: configService.get<string>('DB_USERNAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        database: configService.get<string>('DB_DATABASE'),
        synchronize: false,
        logging: true,
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}
