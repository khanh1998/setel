import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const host = configService.get('RABBITMQ_URL');
  const queueName = configService.get('RABBITMQ_QUEUE');
  const durable = configService.get('RABBITMQ_DURABLE');

  console.log({ host, queueName, durable });

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [host],
      queue: queueName,
      queueOptions: {
        durable: durable,
      },
    },
  });

  app.startAllMicroservices();
}
bootstrap();
