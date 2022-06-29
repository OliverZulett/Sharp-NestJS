import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    // MulterModule.register({
    //   dest: './files'
    // })
  ],
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {}
