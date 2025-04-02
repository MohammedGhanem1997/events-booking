import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });
const config = {
  ELASTICSEARCH_NODE: process.env.ELASTICSEARCH_NODE,
  ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD,
};
console.log(config);

export default registerAs('elasticsearch ', () => config);
