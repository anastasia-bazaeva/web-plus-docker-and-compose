import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kupipodariday',
  synchronize: true,
  entities: ['src/**/**/entity.ts'],
  migrations: [],
});

AppDataSource.initialize();
