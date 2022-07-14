import {
  Body,
  Controller,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as sharp from 'sharp';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ImageProcessorService } from './services/image-processor/image-processor.service';
import { FILES_PATH } from '../../constants/paths.contants';

@Controller('image-processor')
export class ImageProcessorController {
  private readonly logger = new Logger(ImageProcessorController.name);

  private errorHandler = (error) => {
    let errorHandled = error
    throw errorHandled
  }

  constructor(private readonly imageProcessorService: ImageProcessorService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: FILES_PATH,
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const fileName = uuidv4();
          callback(null, `${fileName}-original${fileExtName}`);
        },
      }),
    }),
  )
  applyEffect(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const imageProperties = JSON.parse(body.properties);
    this.logger.debug(image, 'image data');
    this.logger.debug(imageProperties, 'image properties');
    return this.imageProcessorService.processImage(image, imageProperties);
  }
}
