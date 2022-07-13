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

  async convertToFormat(image: Express.Multer.File, format: 'png' | 'jpeg') {
    try {
      const imageName = uuidv4();
      const imagePath = cwd();
      let imageProcessed = this.imageProcessor(image.buffer);
      if (format === 'png') {
        imageProcessed = imageProcessed.png({
          colors: 256, //4,8,16,32,256
          quality: 100,
          compressionLevel: 9,
        });
      } else {
        imageProcessed = imageProcessed.toFormat(format, {
          quality: 100,
        });
      }
      console.log(await imageProcessed.metadata());

      return imageProcessed.toFile(`${imagePath}/files/${imageName}.${format}`);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resizeImage(
    image: Express.Multer.File,
    resizeData?: sharp.ResizeOptions,
  ) {
    try {
      console.log('properties to apply', resizeData);
      const imageExtension = mime.extension(image.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      return this.imageProcessor(image.buffer)
        .resize(resizeData)
        .toFile(
          `${imagePath}/files/${imageName}-${resizeData.position}.${imageExtension}`,
        );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async cropImage(image: Express.Multer.File, cropData?: sharp.Region) {
    try {
      console.log('properties to apply', cropData);
      const imageExtension = mime.extension(image.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      return this.imageProcessor(image.buffer)
        .extract(cropData)
        .resize({
          width: cropData.width * 2,
          height: cropData.height * 2,
        })
        .toFile(`${imagePath}/files/${imageName}.${imageExtension}`);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async trimImage(image: Express.Multer.File, threshold = 10) {
    try {
      console.log('apply trim');
      const imageExtension = mime.extension(image.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      return this.imageProcessor(image.buffer)
        .trim(threshold)
        .toFile(
          `${imagePath}/files/${imageName}-${threshold}.${imageExtension}`,
        );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async composeImage(
    imageBase: Express.Multer.File,
    image1: Express.Multer.File,
    overlayOptions?: any[],
  ) {
    try {
      console.log('properties to apply', overlayOptions);
      const imageBaseMetadata = await this.imageProcessor(
        imageBase.buffer,
      ).metadata();
      const newImage1 = await this.imageProcessor(image1.buffer)
        .resize({
          width: imageBaseMetadata.width,
          height: imageBaseMetadata.height,
          fit: 'cover',
        })
        .toBuffer();
      console.log('metadata', imageBaseMetadata);
      console.log('metadata', newImage1);

      overlayOptions[0].input = newImage1;

      const imageExtension = mime.extension(imageBase.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      return this.imageProcessor(imageBase.buffer)
        .composite(overlayOptions)
        .toFile(
          `${imagePath}/files/${overlayOptions[0].blend}-${overlayOptions[0].gravity}-${imageName}.${imageExtension}`,
        );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async rotateImage(
    image: Express.Multer.File,
    rotateData: {
      angle: number;
      rotationOptions: sharp.RotateOptions;
      flipVertical: boolean;
      flipHorizontal: boolean;
    },
  ) {
    try {
      console.log('properties to apply', rotateData);
      const imageExtension = mime.extension(image.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      let imageProcessed = this.imageProcessor(image.buffer).rotate(
        rotateData.angle,
        rotateData.rotationOptions,
      );

      if (rotateData.flipHorizontal) {
        imageProcessed = imageProcessed.flip();
      }
      if (rotateData.flipVertical) {
        imageProcessed = imageProcessed.flop();
      }

      return imageProcessed.toFile(
        `${imagePath}/files/${imageName}.${imageExtension}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setImageEffect(
    image: Express.Multer.File,
    effectsData: {
      blur: number;
      negate: boolean;
      threshold: number;
      modulate: {
        brightness: number;
        saturation: number;
        hue: number;
        lightness: number;
      };
      tint: sharp.Color;
      grayscale: boolean;
    },
  ) {
    try {
      console.log('properties to apply', effectsData);
      const imageExtension = mime.extension(image.mimetype);
      const imageName = uuidv4();
      const imagePath = cwd();
      let imageProcessed = this.imageProcessor(image.buffer);
      if (effectsData.blur) {
        imageProcessed = imageProcessed.blur(effectsData.blur);
      }
      if (effectsData.negate) {
        imageProcessed = imageProcessed.negate();
      }
      if (effectsData.threshold) {
        imageProcessed = imageProcessed.threshold(effectsData.threshold);
      }
      if (effectsData.grayscale) {
        imageProcessed = imageProcessed.grayscale();
      }
      if (effectsData.tint) {
        imageProcessed = imageProcessed.tint(effectsData.tint);
      }
      if (effectsData.modulate) {
        imageProcessed = imageProcessed.modulate(effectsData.modulate);
      }
      return imageProcessed.toFile(
        `${imagePath}/files/${imageName}.${imageExtension}`,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
