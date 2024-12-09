import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const setupSwagger = (app: INestApplication) => {
	const options = new DocumentBuilder()
		.setTitle('Elastic Search API Operations')
		.setDescription('Rest API docs')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document, { swaggerOptions: { persistAuthorization: true } });
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT
  const logger = new Logger('Starting up the server....');
  app.useLogger(['log', 'debug', 'warn', 'error'])
  setupSwagger(app)
  await app.listen(PORT);
  logger.log(`App Started on http://localhost:${PORT}`);
}
bootstrap();
