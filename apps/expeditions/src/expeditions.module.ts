import { Module } from '@nestjs/common';
import { ExpeditionsController } from './expeditions.controller';
import { ExpeditionsService } from './expeditions.service';
import { AUTH_SERVICE, CommonAuthModule, DatabaseModule, QueryModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RegionModule } from './region/region.module';
import { ReportModule } from './report/report.module';
import { ServiceModule } from './service/service.module';
import { ShipmentModule } from './shipment/shipment.module';
import { StatusShipmentModule } from './status-shipment/status-shipment.module';

@Module({
  imports: [ExpeditionsModule, DatabaseModule, QueryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    RegionModule, CommonAuthModule
  ],
  controllers: [ExpeditionsController],
  providers: [ExpeditionsService, ConfigService],
})
export class ExpeditionsModule { }
