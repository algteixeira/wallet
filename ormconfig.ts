import { TypeOrmModuleOptions } from '@nestjs/typeorm';
 
export const Config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'wallet',
  entities: ["dist/src/**/entities/*.entity{.ts,.js}"],
  autoLoadEntities: true,
  synchronize: true,
}