import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Starting up the server....');
  const PORT = process.env.PORT || 8008
  await app.listen(PORT);
  logger.log(`App Started on http://localhost:${PORT}`);
}
bootstrap();
