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
      return await this.imageProcessor(imageBuffer).toFile(
        `${path}/${imageName}`,
      );
    } catch (error) {
      this.logger.error(`Error storing image: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error storing image`,
      );
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

  async rotateImage(
    imageBuffer: Buffer,
    rotateProperties: {
      angle?: number;
      options?: sharp.RotateOptions;
    },
  ) {
    try {
      this.logger.debug(`rotating image`);
      return await this.imageProcessor(imageBuffer)
        .rotate(rotateProperties.angle, rotateProperties.options)
        .toBuffer();
    } catch (error) {
      this.logger.error(`Error rotating image: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error rotating image`,
      );
    }
  }

  async verticalFlipImage(imageBuffer: Buffer) {
    try {
      this.logger.debug(`flipping image vertical`);
      return await this.imageProcessor(imageBuffer).flip().toBuffer();
    } catch (error) {
      this.logger.error(`Error flipping image vertical: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error flipping image vertical`,
      );
    }
  }

  async horizontalFlipImage(imageBuffer: Buffer) {
    try {
      this.logger.debug(`flipping image vertical`);
      return await this.imageProcessor(imageBuffer).flop().toBuffer();
    } catch (error) {
      this.logger.error(`Error flipping image vertical: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error flipping image vertical`,
      );
    }
  }

  async setImageEffects(
    imageBuffer: Buffer,
    effectsProperties: {
      median: number;
      blur: number;
      negate: boolean;
      grayscale: boolean;
      threshold: number;
      thresholdGrayscale: boolean;
      brightness: number;
      saturation: number;
      hue: number;
      lightness: number;
      tint: sharp.Color;
    },
  ) {
    try {
      this.logger.debug(`applying image effects`);
      if (effectsProperties.threshold) {
        imageBuffer = await this.imageProcessor(imageBuffer)
          .threshold(effectsProperties.threshold || 120, {
            grayscale: effectsProperties.thresholdGrayscale || false,
          })
          .toBuffer();
      }
      return await this.imageProcessor(imageBuffer)
        .median(effectsProperties.median || 3)
        .blur(effectsProperties.blur || 0.3)
        .negate(effectsProperties.negate || false)
        .grayscale(effectsProperties.grayscale || false)
        .modulate({
          brightness: effectsProperties.brightness || 1,
          saturation: effectsProperties.saturation || 1,
          hue: effectsProperties.hue || 0,
          lightness: effectsProperties.lightness || 1,
        })
        .tint(effectsProperties.tint)
        .toBuffer();
    } catch (error) {
      this.logger.error(`Error applying image effects: ${error}`);
      throw new InternalServerErrorException(
        error.message,
        `Error applying image effects`,
      );
    }
  }
}
