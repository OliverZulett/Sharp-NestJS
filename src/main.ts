import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env?.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Image processor API')
      .setDescription('Api de procesamiento de imagenes')
      .setVersion(process.env.API_VERSION)
      .addTag('images')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  app.setGlobalPrefix(process.env.API_VERSION);
  await app.listen(process.env.API_PORT);
}
bootstrap();
