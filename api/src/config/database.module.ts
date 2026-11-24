import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Escrita — Postgres 16 (servidor03)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        type: 'postgres',
        host: c.getOrThrow<string>('DB_HOST'),
        port: Number(c.get('DB_PORT', 5432)),
        database: c.getOrThrow<string>('DB_NAME'),
        username: c.getOrThrow<string>('DB_USER'),
        password: c.getOrThrow<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
        logging: ['error'],
      }),
    }),

    // Leitura — Oracle
    TypeOrmModule.forRootAsync({
      name: 'oracle',
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({
        name: 'oracle',
        type: 'oracle',
        host: c.getOrThrow<string>('ORA_HOST'),
        port: Number(c.get('ORA_PORT', 1521)),
        serviceName: c.getOrThrow<string>('ORA_SERVICE'),
        username: c.getOrThrow<string>('ORA_USER'),
        password: c.getOrThrow<string>('ORA_PASSWORD'),
        entities: [],
        synchronize: false,
        logging: ['error'],
        extra: { poolMin: 0, poolMax: 5, poolTimeout: 60 },
      }),
    }),
  ],
})
export class DatabaseModule {}