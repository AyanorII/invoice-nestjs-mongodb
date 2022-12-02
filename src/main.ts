import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  const logger = new Logger('Main', { timestamp: true });

  await app.listen(port);
  logger.log(`Listening on port ${port}`);
}
bootstrap();
