import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import packageJson from '@/../package.json';
import { AppModule } from './app/app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { McpModule } from './modules/mcp/mcp.module';
import { McpGroupModule } from './modules/mcp-group/mcp-group.module';
import { UserModule } from './modules/user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');
  const isProduction = configService.get('NODE_ENV') === 'production';

  app.enableCors({
    origin:  [process.env.CORS_ORIGIN || 'http://localhost:3000'],
    methods: [
      'GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    transform:            true,
    whitelist:            true,
    forbidNonWhitelisted: true,
    exceptionFactory:     errors => {
      const messages = errors.map(err => `${err.property} - ${Object.values(err.constraints ?? {}).join(', ')}`);

      return new BadRequestException(messages);
    },
  }));

  app.useGlobalInterceptors(new TransformInterceptor);

  const config = (new DocumentBuilder)
    .setTitle('USlash API')
    .setDescription('USlash Backend API Documentation')
    .setVersion(packageJson.version)
    .addBearerAuth({
      type:         'http',
      scheme:       'bearer',
      bearerFormat: 'JWT',
      name:         'JWT',
      description:  'Enter JWT token',
      in:           'header',
    },
    'JWT-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config, { include: [
    AuthModule, UserModule, McpModule, McpGroupModule,
  ] });

  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions:  {
      persistAuthorization:   true,
      displayRequestDuration: true,
      docExpansion:           'none',
      filter:                 true,
      showRequestHeaders:     true,
    },
  });

  await app.listen(8000, '0.0.0.0');

  logger.log(`Application version ${packageJson.version} is running on: ${await app.getUrl()}`);

  logger.debug(`Environment: ${isProduction ? 'production' : 'development'}`);
}

bootstrap();
