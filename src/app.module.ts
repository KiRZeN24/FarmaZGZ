import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: { rejectUnauthorized: false },
        logging: true,
      }),
      inject: [ConfigService],
    }),
    PharmaciesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
