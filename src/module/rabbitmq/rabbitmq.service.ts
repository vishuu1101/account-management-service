import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  private readonly RABBITMQ_URL = this.configService.get('RABBITMQ_URL');
  private readonly EXCHANGE_NAME = this.configService.get('EXCHANGE_NAME');
  private readonly EXCHANGE_TYPE = 'direct';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }
  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    try {
      this.connection = await amqplib.connect(this.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(
        this.EXCHANGE_NAME,
        this.EXCHANGE_TYPE,
        {
          durable: true,
        },
      );
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  private async disconnect() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Failed to disconnect from RabbitMQ', error);
    }
  }
}
