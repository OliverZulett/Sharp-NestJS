import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProcessorService } from './services/processor/processor.service';
import { v4 as uuidv4 } from 'uuid';
import { ImageProperties } from './models/imageProperties.model';

@Controller('processor')
export class ProcessorController {
  private readonly logger = new Logger(ProcessorController.name);

  constructor(private readonly processorService: ProcessorService) {}

  @Post('process')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  processImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const imageProperties = JSON.parse(body.properties);
    this.logger.debug('image: ', image);
    this.logger.debug('image properties: ', imageProperties);
    return this.processorService.processImage(image, imageProperties);
  }

  @Get('metadata')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  getMetadata(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
    return this.processorService.getMetadata(image);
  }

  @Get('stats')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  getStats(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
    return this.processorService.getStats(image);
  }

  @Post('store')
  @UseInterceptors(FileInterceptor('image'))
  storeImage(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
    return this.processorService.storeImage(image);
  }
}
