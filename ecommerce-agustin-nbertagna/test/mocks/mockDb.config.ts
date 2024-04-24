import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { registerAs } from '@nestjs/config';

config({ path: '.env.development' });

const databaseConfig: DataSourceOptions & { autoLoadEntities: boolean } = {
  type: 'postgres',
  database: process.env.TEST_DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false,
  synchronize: true,
  dropSchema: true,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
};

export const connectionSource: DataSource = new DataSource(
  databaseConfig as DataSourceOptions,
);

export default registerAs('typeorm', () => databaseConfig);
