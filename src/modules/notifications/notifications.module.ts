import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MisrSmsServiceProvider } from 'src/service-provider/sms-notification/sms-service-provider';
import { NotificationsConsumer } from './notifications.consumer';

@Module({
  controllers: [],
  providers: [
    NotificationsService,
    MisrSmsServiceProvider,
    NotificationsConsumer,
  ],
})
export class NotificationsModule {}
