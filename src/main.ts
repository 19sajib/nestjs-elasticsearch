import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT
  const logger = new Logger('Starting up the server....');
  app.useLogger(['log', 'debug', 'warn', 'error'])
  await app.listen(PORT);
  logger.log(`App Started on http://localhost:${PORT}`);
}
bootstrap();
