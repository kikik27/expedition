import { NestFactory } from '@nestjs/core';
import { ExpeditionsModule } from './expeditions.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ExceptionService, ResponseInterceptor } from '@app/common';
import { UserInterceptor } from '@app/common/interceptor/user-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ExpeditionsModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('APP_PORT') || 3000;
  const host = configService.get('APP') || 'localhost'

  const Authport = configService.get<number>('AUTH_PORT') || 3001;
  const Authhost = configService.get('AUTH_HOST') || 'localhost'

  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  if (nodeEnv !== 'production') {
    const swaggerHost = `http://localhost:${Authport}`

    const config = new DocumentBuilder()
      .setTitle('Expedition API')
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
      customSiteTitle: 'Expedition Api Docs',
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

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new ExceptionService());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new UserInterceptor());

  await app.listen(port);

  nodeEnv == 'development' && console.log(`App running at http://localhost:${port}`);
}
bootstrap();
