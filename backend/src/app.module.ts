import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.getOrThrow<string>('DATABASE_DRIVER');
        if (driver !== 'postgres') {
          throw new Error(
            `Unsupported DATABASE_DRIVER: ${driver}. Expected "postgres".`,
          );
        }

        const databaseUrl = new URL(
          configService.getOrThrow<string>('DATABASE_URL'),
        );

        return {
          type: 'postgres' as const,
          host: databaseUrl.hostname,
          port: Number(databaseUrl.port || 5432),
          database: databaseUrl.pathname.replace(/^\//, ''),
          username: String(
            configService.getOrThrow<string>('DATABASE_USERNAME'),
          ),
          password: String(
            configService.getOrThrow<string>('DATABASE_PASSWORD'),
          ),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    FilmsModule,
    OrderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
