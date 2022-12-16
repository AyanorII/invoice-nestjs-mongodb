import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
  });

  const config = new DocumentBuilder().setTitle('Invoice API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger('Main', { timestamp: true });

  await app.listen(port);
  logger.log(`Listening on port ${port}`);
}

bootstrap();
