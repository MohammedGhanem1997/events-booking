import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { MisrSmsServiceProvider } from 'src/service-provider/sms-notification/sms-service-provider';

@Injectable()
export class NotificationsConsumer implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly queueName = 'sms_notifications';

  constructor(
    private readonly smsProviderService: MisrSmsServiceProvider,
    private readonly configService: ConfigService,
  ) {}

  private SMS_API_URL = this.configService.get<string>('SMS_API_URL');
  private rabbitmqUser = this.configService.get<string>(
    'RABBITMQ_DEFAULT_USER',
  );
  private rabbitmqPass = this.configService.get<string>(
    'RABBITMQ_DEFAULT_PASS',
  );
  private rabbitmqHost = this.configService.get<string>(
    'RABBITMQ_HOST',
    'rabbitmq',
  );
  private rabbitmqPort = this.configService.get<number>('RABBITMQ_PORT', 5672);

  async onModuleInit() {
    await this.connectToRabbitMQ();
  }

  async onModuleDestroy() {
    await this.disconnectFromRabbitMQ();
  }

  private async connectToRabbitMQ() {
    try {
      const rabbitmqUrl = `amqp://${this.rabbitmqUser}:${this.rabbitmqPass}@${this.rabbitmqHost}:${this.rabbitmqPort}`;
      console.log('Connecting to RabbitMQ:', rabbitmqUrl);
      console.log('sms config', this.SMS_API_URL);
      console.log('API SMS', this.configService.get('SMS_ID'));

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: true });
      this.channel.consume(this.queueName, (msg) => {
        console.log('Received message:', msg?.content.toString());

        if (msg !== null) {
          const messageContent = JSON.parse(msg.content.toString());
          let message = `your order ${messageContent?.id} was conformed order amount is ${messageContent?.totalAmount}`;
          this.processMessage(messageContent);
          this.channel.ack(msg);
        }
      });
      console.log(
        'Connected to RabbitMQ and consuming messages from queue:',
        this.queueName,
      );
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error.message);
    }
  }

  async processMessage(message: { phoneNumber: string; body: string }) {
    try {
      const { phoneNumber, body } = message;
      const response = await this.smsProviderService.sendSms(phoneNumber, body);
      console.log('SMS sent successfully:', response);
    } catch (error) {
      console.error('Failed to send SMS:', error.message);
    }
  }

  private async disconnectFromRabbitMQ() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }
}
