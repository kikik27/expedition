import { NestFactory } from '@nestjs/core';
import { ExpeditionsModule } from './expeditions.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExpeditionsModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
