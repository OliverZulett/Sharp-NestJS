import { Injectable } from '@nestjs/common';
import { SharpService } from '../sharp/sharp.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ImageProperties } from '../../models/imageProperties.model';

@Injectable()
export class ProcessorService {
  constructor(private readonly sharpService: SharpService) {}

  processImage(image: Express.Multer.File, imageProperties: ImageProperties) {
    const imagePath = image.path;
    if (imageProperties.convertProperties) {
      this.sharpService.convertFormat(imagePath, imageProperties.convertProperties)
    }
  }

  getMetadata(image: Express.Multer.File) {
    return this.sharpService.getMetadata(image.path);
  }

  getStats(image: Express.Multer.File) {
    return this.sharpService.getStats(image.path);
  }

  storeImage(image: Express.Multer.File) {
    const fileName = uuidv4();
    const fileExt = extname(image.originalname);
    return this.sharpService.storeImage(
      image.buffer,
      './images',
      `${fileName}${fileExt}`,
    );
  }
}
