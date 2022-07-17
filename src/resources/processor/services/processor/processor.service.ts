import { Injectable } from '@nestjs/common';
import { SharpService } from '../sharp/sharp.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ImageProperties } from '../../models/imageProperties.model';

@Injectable()
export class ProcessorService {
  constructor(private readonly sharpService: SharpService) {}

  async processImage(
    image: Express.Multer.File,
    imageProperties: ImageProperties,
  ) {
    const imagePath = image.path;
    const imageName = image.filename;
    let imageBuffer = await this.sharpService.getImageBuffer(image.path);
    if (imageProperties.convertProperties) {
      imageBuffer = await this.sharpService.convertFormat(
        imagePath,
        imageProperties.convertProperties,
      );
    }
    if (imageProperties.resizeProperties) {
      imageBuffer = await this.sharpService.resizeImage(
        imageBuffer,
        imageProperties.resizeProperties,
      );
    }
    const { format } = await this.sharpService.getMetadata(imageBuffer);
    return this.sharpService.storeImage(
      imageBuffer,
      './processed-image',
      `${imageName}.${format}`,
    );
  }

  getMetadata(image: Express.Multer.File) {
    return this.sharpService.getMetadata(image.buffer);
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
