import { Injectable } from '@nestjs/common';
import { SharpService } from '../sharp/sharp.service';
import { v4 as uuidv4 } from 'uuid';
import { basename, extname } from 'path';
import { ImageProperties } from '../../models/imageProperties.model';
import {
  PROCESSED_IMAGE_PATH,
  UNPROCESSED_IMAGE_PATH,
} from '../../../../constants/path.constants';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ProcessorService {
  constructor(private readonly sharpService: SharpService) {
    if (!existsSync(UNPROCESSED_IMAGE_PATH)) {
      mkdirSync(UNPROCESSED_IMAGE_PATH);
    }
    if (!existsSync(PROCESSED_IMAGE_PATH)) {
      mkdirSync(PROCESSED_IMAGE_PATH);
    }
  }

  async processImage(
    image: Express.Multer.File,
    imageProperties: ImageProperties,
  ) {
    const imagePath = image.path;
    const imageName = basename(imagePath, extname(image.filename));

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
    if (imageProperties.cropProperties) {
      imageBuffer = await this.sharpService.cropImage(
        imageBuffer,
        imageProperties.cropProperties,
      );
    }
    if (imageProperties.rotateProperties) {
      imageBuffer = await this.sharpService.rotateImage(
        imageBuffer,
        imageProperties.rotateProperties,
      );
    }
    if (imageProperties.verticalFlip) {
      imageBuffer = await this.sharpService.verticalFlipImage(imageBuffer);
    }
    if (imageProperties.horizontalFlip) {
      imageBuffer = await this.sharpService.horizontalFlipImage(imageBuffer);
    }
    if (imageProperties.effectsProperties) {
      imageBuffer = await this.sharpService.setImageEffects(
        imageBuffer,
        imageProperties.effectsProperties,
      );
    }
    if (imageProperties.effectsProperties) {
      imageBuffer = await this.sharpService.setImageEffects(
        imageBuffer,
        imageProperties.effectsProperties,
      );
    }
    if (imageProperties.trimLevel) {
      imageBuffer = await this.sharpService.trimImage(
        imageBuffer,
        imageProperties.trimLevel,
      );
    }
    if (imageProperties.transparencyBackgroundColor) {
      imageBuffer = await this.sharpService.setTransparencyBackgroundColor(
        imageBuffer,
        imageProperties.transparencyBackgroundColor,
      );
    }
    const { format } = await this.sharpService.getMetadata(imageBuffer);
    return this.sharpService.storeImage(
      imageBuffer,
      PROCESSED_IMAGE_PATH,
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
