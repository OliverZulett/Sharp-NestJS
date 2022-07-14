import { Module } from '@nestjs/common';

import { ImageProcessorController } from './image-processor.controller';
import { SharpService } from './services/sharp/sharp.service';
import { ImageProcessorService } from './services/image-processor/image-processor.service';

@Module({
  controllers: [ImageProcessorController],
  providers: [ImageProcessorService, SharpService],
})
export class ImageProcessorModule {}
