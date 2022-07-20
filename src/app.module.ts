import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './resources/images/images.module';
import { ProcessorModule } from './resources/processor/processor.module';

@Module({
  imports: [ConfigModule.forRoot(), ImagesModule, ProcessorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
