import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'student',
  password: 'student',
  database: 'kupipodariday',
  synchronize: true,
  entities: ['src/**/**/entity.ts'],
  migrations: [],
});

AppDataSource.initialize();
