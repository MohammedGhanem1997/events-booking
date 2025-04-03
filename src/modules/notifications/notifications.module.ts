import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MisrSmsServiceProvider } from 'src/service-provider/sms-notification/sms-service-provider';

@Module({
  controllers: [],
  providers: [NotificationsService, MisrSmsServiceProvider],
})
export class NotificationsModule {}
