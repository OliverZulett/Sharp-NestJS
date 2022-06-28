import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_VERSION);
  const config = new DocumentBuilder()
    .setTitle('Image Processor API')
    .setDescription('Api for image processing')
    .setVersion(process.env.API_VERSION)
    .addTag('images')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.API_PORT);
}
bootstrap();
