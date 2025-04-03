import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Order } from '../orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}

  public async publishOrderCreated(order: Order) {
    const rabbitmqUser = this.configService.get<string>(
      'rabbitmq.RABBITMQ_DEFAULT_USER',
    );
    const rabbitmqPass = this.configService.get<string>(
      'rabbitmq.RABBITMQ_DEFAULT_PASS',
    );
    const rabbitmqHost = this.configService.get<string>(
      'rabbitmq.RABBITMQ_HOST',
      'localhost',
    );
    const rabbitmqPort = this.configService.get<number>(
      'rabbitmq.RABBITMQ_PORT',
      5672,
    );

    const rabbitmqUrl = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`;
    console.log('Connecting to RabbitMQ:', rabbitmqUrl);

    try {
      const connection = await amqp.connect(rabbitmqUrl);
      const channel = await connection.createChannel();

      const queue = 'sms_notifications';
      const message = JSON.stringify(order);
      console.log('Message:', message);
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

      console.log('Message sent to queue:', message);
      await channel.close();
      await connection.close();

      console.log(`Sending SMS to  ${message}`);
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }
}
