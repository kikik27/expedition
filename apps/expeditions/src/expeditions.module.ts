import { Module } from '@nestjs/common';
import { ExpeditionsService } from './expeditions.service';
import { DatabaseModule, QueryModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegionModule } from './region/region.module';
import { AuthClientModule } from './auth-client/auth-client.module';
import { ReportModule } from './report/report.module';
import { ServiceModule } from './service/service.module';
import { ShipmentModule } from './shipment/shipment.module';
import { StatusShipmentModule } from './status-shipment/status-shipment.module';
import * as Joi from 'joi';
@Module({
  imports: [ExpeditionsModule, DatabaseModule, QueryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    AuthClientModule,
    RegionModule, ReportModule, ServiceModule, ShipmentModule, StatusShipmentModule
  ],
  controllers: [],
  providers: [ExpeditionsService, ConfigService],
})
export class ExpeditionsModule { }
``