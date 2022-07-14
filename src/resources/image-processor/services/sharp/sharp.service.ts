import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { extname } from 'path';
import * as sharp from 'sharp';
import { FILES_PATH } from 'src/constants/paths.contants';
import { ImageProperties } from '../../modets/imageProperties';
import { buffer } from 'stream/consumers';

@Injectable()
export class SharpService {
  private readonly logger = new Logger(SharpService.name);
  private imageProcessor = sharp;

  constructor() {
    this.imageProcessor.cache(false);
  }

  async storeImage(imageBuffer: Buffer, imageName: string) {
    try {
      const format = (await this.imageProcessor(imageBuffer).metadata()).format;
      return this.imageProcessor(imageBuffer).toFile(
        `${FILES_PATH}/${imageName.split('-original')[0]}-processed.${format}`,
      );
    } catch (error) {
      this.logger.error(`Error saving image: ${error}`);
      throw new InternalServerErrorException(error.message, 'Error saving image');
    }
  }

  async convertToFormat(
    imageBuffer: Buffer,
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
      if (convertProperties.options) {
        return this.imageProcessor(imageBuffer)
          .toFormat(convertProperties.format, convertProperties.options)
          .toBuffer();
      }
      return this.imageProcessor(imageBuffer)
        .toFormat(convertProperties.format)
        .toBuffer();
    } catch (error) {
      this.logger.error(`Error converting image: ${error}`);
      throw new InternalServerErrorException(error.message, 'Error converting image');
    }
  }
}
