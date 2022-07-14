import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { ImageProperties } from '../../modets/imageProperties';
import { SharpService } from '../sharp/sharp.service';

@Injectable()
export class ImageProcessorService {
  private readonly logger = new Logger(ImageProcessorService.name);
  private imageProcessor = sharp;

  constructor(private readonly sharpService: SharpService) {
    this.imageProcessor.cache(false);
  }

  async processImage(
    image: Express.Multer.File,
    imageProperties: ImageProperties,
  ) {
    this.logger.debug(`Start processing for image: ${image.filename}`);
    let imageBuffer = await sharp(image.path).toBuffer();

    if (imageProperties.convertProperties) {
      imageBuffer = await this.sharpService.convertToFormat(
        imageBuffer,
        imageProperties.convertProperties,
      );
    }
    this.logger.debug(`Finish processing for image: ${image.filename}`);
    return this.sharpService.storeImage(imageBuffer, image.filename);
  }
}
