import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PharmacieService } from './pharmacie.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly pharmacieService: PharmacieService) {}

  @Cron('0 0 * * *', {
    timeZone: 'Europe/Madrid',
  })
  async syncPharmaciesDaily() {
    this.logger.log('Iniciando sincronización automática diaria...');

    try {
      const pharmacies = await this.pharmacieService.syncWithAyuntamiento();
      this.logger.log(
        `Sincronización automática completada: ${pharmacies.length} farmacias actualizadas`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error('Error en sincronización automática:', errorMessage);
    }
  }
}
