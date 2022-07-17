import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class SharpService {
  private logger = new Logger(SharpService.name);
  private imageProcessor = sharp;

  constructor() {
    this.imageProcessor.cache(false);
  }

  getMetadata(imagePath: string) {
    try {
      this.logger.debug('getting image metadata');
      return this.imageProcessor(imagePath).metadata();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  getStats(imagePath: string) {
    try {
      this.logger.debug('getting image metadata', imagePath);
      return this.imageProcessor(imagePath).stats();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  storeImage(imageBuffer: Buffer, path: string, imageName: string) {
    try {
      this.logger.debug(`storing image: ${imageName}`);
      return this.imageProcessor(imageBuffer).toFile(`${path}/${imageName}`);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  convertFormat(
    imagePath: string,
    convertProperties: {
      format: keyof sharp.FormatEnum;
      options?:
        | sharp.OutputOptions
        | sharp.JpegOptions
        | sharp.PngOptions
        | sharp.WebpOptions
        | sharp.AvifOptions
        | sharp.HeifOptions
        | sharp.GifOptions
        | sharp.TiffOptions;
    },
  ) {
    try {
      this.logger.debug(
        `convert image: ${imagePath} to ${convertProperties.format}`,
      );
      if (convertProperties.options) {
        return this.imageProcessor(imagePath)
          .toFormat(convertProperties.format, convertProperties.options)
          .toBuffer();
      }
      return this.imageProcessor(imagePath)
        .toFormat(convertProperties.format)
        .toBuffer();
    } catch (error) {
      this.logger.error(`Error converting image: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error converting image`,
      );
    }
  }
}
