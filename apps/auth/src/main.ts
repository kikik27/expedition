import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionService, ResponseInterceptor } from '@app/common';
import * as cookieParser from 'cookie-parser';
import { UserInterceptor } from '@app/common/interceptor/user-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_PORT') || 3001;
  const host = configService.get('AUTH_HOST') || 'localhost'
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  if (nodeEnv !== 'production') {
    const swaggerHost =
      nodeEnv === 'development'
        ? `http://localhost:${port}`
        : host;

    const config = new DocumentBuilder()
      .setTitle('Expedition Auth Gateway')
      .setVersion('1.0')
      .addOAuth2({
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: `${swaggerHost}/auth/login`,
            scopes: {
              read: 'Read access',
              write: 'Write access',
            },
          },
        },
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);

    const swaggerCustomOptions: SwaggerCustomOptions = {
      customSiteTitle: 'Expedition Auth Gateway',
      customCss: '.swagger-ui .topbar { display: none }',
      explorer: true,
      jsonDocumentUrl: 'docs/json',
      swaggerOptions: {
        persistAuthorization: true,
        oauth2RedirectUrl: `${swaggerHost}/docs/oauth2-redirect.html`, // <-- disesuaikan dengan port
      },
    };

    SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
  }

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host, port
    },
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new ExceptionService());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new UserInterceptor());

  await app.startAllMicroservices();
  await app.listen(port);

  nodeEnv == 'development' && console.log(`App running at http://localhost:${port}`);
}
bootstrap();
