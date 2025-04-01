import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
const config = {
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  username: process.env.DB_USER || 'myuser',
  password: process.env.DB_PASSWORD || 'mypass',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DATABASE || 'event_booking',
  synchronize: process.env.TYPE_ORM_SYNC === 'ON',
  logger: 'advanced-console',
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: false,
};
console.log(config);

export default registerAs('database', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
