import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function generateSwaggerJSON() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('TimePhone-API')
    .setDescription('The Magic TimePhone as a Service!')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger.json', JSON.stringify(document));
  app.close();
}

generateSwaggerJSON();
