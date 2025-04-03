import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface SmsServiceProvider {
  sendSms(to: string, message: string): Promise<boolean>;
}

export class MisrSmsServiceProvider implements SmsServiceProvider {
  private apiUrl: string;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('SMS_MISR_URL');
    this.apiKey = this.configService.get<string>('SMS_MISR_KEY');
  }

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
