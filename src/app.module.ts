import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './resources/images/images.module';

@Module({
  imports: [ConfigModule.forRoot(), ImagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
