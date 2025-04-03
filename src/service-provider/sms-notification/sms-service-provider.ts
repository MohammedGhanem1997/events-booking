import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface SmsServiceProvider {
  sendSms(to: string, message: string): Promise<boolean>;
}

@Injectable()
export class MisrSmsServiceProvider {
  constructor(private readonly configService: ConfigService) {}

  private apiUrl = this.configService.get<string>('SMS_MISR_URL');
  private apiKey = this.configService.get<string>('SMS_MISR_KEY');

  async sendSms(to: string, message: string): Promise<boolean> {
    try {
      const response = await axios.post(this.apiUrl, {
        to,
        message,
        apiKey: this.apiKey,
      });

      if (response.status === 200 && response.data.success) {
        console.log('SMS sent successfully:', response.data);
        return true;
      } else {
        console.error('Failed to send SMS:', response.data);
        return false;
      }
    } catch (error) {
      console.error('Error while sending SMS:', error);
      return false;
    }
  }
}
