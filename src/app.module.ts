import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './resources/images/images.module';
import { ImageProcessorModule } from './resources/image-processor/image-processor.module';

@Module({
  imports: [ConfigModule.forRoot(), ImagesModule, ImageProcessorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
