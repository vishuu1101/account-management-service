import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { BadRequestExceptionFilter } from './filter/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
    },
  });

  // enabling CORS for specific host's
  app.enableCors({
    origin: ['http://localhost:3000', 'https://tradeling-portal.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.useGlobalFilters(new BadRequestExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Accounts')
    .setDescription('Accounts API - User Management Module')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('account', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
