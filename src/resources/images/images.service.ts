import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { buffer } from 'stream/consumers';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { cwd } from 'process';

@Injectable()
export class ImagesService {
  private logger = new Logger(ImagesService.name);
  private imageProcessor = sharp;

  constructor() {
    this.imageProcessor.cache(false);
  }

  getMetadata(imagePath: string) {
    try {
      return this.imageProcessor(imagePath).metadata();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  getStats(imagePath: string) {
    try {
      return this.imageProcessor(imagePath).stats();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  store(image: Express.Multer.File) {
    try {
      const imageExtension = mime.extension(image.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      this.imageProcessor(image.buffer).toFile(
        `${imagePath}/files/${imageName}.${imageExtension}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  save(imagePath: string) {
    try {
      return this.imageProcessor(imagePath).stats();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
