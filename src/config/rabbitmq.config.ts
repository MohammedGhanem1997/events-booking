import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
const config = {
  RABBITMQ_DEFAULT_USER: process.env.RABBITMQ_DEFAULT_USER,
  RABBITMQ_DEFAULT_PASS: process.env.ELASTICSEARCH_USERNAME,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST,
  RABBITMQ_PORT: process.env.RABBITMQ_PORT,
};
console.log(config);

export default registerAs('rabbitmq ', () => config);
