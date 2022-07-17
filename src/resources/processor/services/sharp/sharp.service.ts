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

  async getMetadata(imageBuffer: Buffer) {
    try {
      this.logger.debug('getting image metadata');
      return this.imageProcessor(imageBuffer).metadata();
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

  async storeImage(imageBuffer: Buffer, path: string, imageName: string) {
    try {
      this.logger.debug(`storing image: ${imageName}`);
      return await this.imageProcessor(imageBuffer).toFile(`${path}/${imageName}`);
    } catch (error) {
      this.logger.error(`Error storing image: ${error}`);
      throw new InternalServerErrorException(error.message, `Error storing image`);
    }
  }

  async convertFormat(
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

  async resizeImage(
    imageBuffer: Buffer,
    resizeProperties: {
      width?: number;
      height?: number;
      options?: {
        width?: number | undefined;
        height?: number | undefined;
        fit?: keyof sharp.FitEnum | undefined;
        position?: number | string | undefined;
        background?: sharp.Color | undefined;
        kernel?: keyof sharp.KernelEnum | undefined;
        withoutEnlargement?: boolean | undefined;
        withoutReduction?: boolean | undefined;
        fastShrinkOnLoad?: boolean | undefined;
      };
    },
  ) {
    try {
      this.logger.debug(`resizing image`);
      return this.imageProcessor(imageBuffer)
        .resize(resizeProperties.width, resizeProperties.height)
        .toBuffer();
    } catch (error) {
      this.logger.error(`Error converting image: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error converting image`,
      );
    }
  }

  async getImageBuffer(imagePath: string) {
    try {
      this.logger.debug(`getting image buffer`);
      return this.imageProcessor(imagePath).toBuffer();
    } catch (error) {
      this.logger.error(`Error getting image buffer: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error getting image buffer`,
      );
    }
  }

  async cropImage(
    imageBuffer: Buffer,
    cropProperties: {
      left: number;
      top: number;
      width: number;
      height: number;
    },
  ) {
    try {
      this.logger.debug(`cropping image`);
      return this.imageProcessor(imageBuffer)
        .extract(cropProperties)
        .toBuffer();
    } catch (error) {
      this.logger.error(`Error cropping image: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error cropping image`,
      );
    }
  }
}
