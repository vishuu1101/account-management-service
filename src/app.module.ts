import { Module } from '@nestjs/common';
import { UsersModule } from './module/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PermissionModule } from './module/permission/permission.module';
import { ResponseUtil } from './util/response.util';
import { RoleModule } from './module/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        password: configService.get<string>('DB_PASSWORD'),
        username: configService.get<string>('DB_USERNAME'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        database: configService.get<string>('DB_DATABASE'),
        logging: false,
      }),
    }),
    UsersModule,
    PermissionModule,
    RoleModule,
  ],
  providers: [ResponseUtil],
  exports: [ResponseUtil],
})
export class AppModule {}
