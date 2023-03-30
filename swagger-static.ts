import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import * as fs from 'fs';
import * as swaggerUi from 'swagger-ui-express';

async function generateSwaggerJSON() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('My API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger.json', JSON.stringify(document));
  app.close();
}

async function serveSwaggerUI() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  await app.listen(3000);
}

generateSwaggerJSON();
