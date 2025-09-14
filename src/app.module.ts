import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PharmaciesModule } from './pharmacies/pharmacies.module';

@Module({
  imports: [PharmaciesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
