import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProcessorService } from './services/processor/processor.service';
import { v4 as uuidv4 } from 'uuid';
import {
  UNPROCESSED_IMAGE_PATH,
} from '../../constants/path.constants';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiExtraModels, ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ImageProperties } from './models/imageProperties.model';

@ApiTags('processor')
@Controller('processor')
export class ProcessorController {
  private readonly logger = new Logger(ProcessorController.name);

  constructor(private readonly processorService: ProcessorService) {
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'file',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Image stored successfully'
  })
  @Post('store')
  @UseInterceptors(FileInterceptor('image'))
  storeImage(@UploadedFile() image: Express.Multer.File) {
    this.logger.debug('image: ', image);
    return this.processorService.storeImage(image);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'file',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Get metadata successfully'
  })
  @Post('metadata')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  getMetadata(@UploadedFile() image: Express.Multer.File) {
    this.logger.debug('image: ', image);
    return this.processorService.getMetadata(image);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'file',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Get stats successfully'
  })
  @Post('stats')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  getStats(@UploadedFile() image: Express.Multer.File) {
    this.logger.debug('image: ', image);
    return this.processorService.getStats(image);
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(ImageProperties)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'file',
        },
        properties: {
          $ref: getSchemaPath(ImageProperties),
        }
      },
    },
  })
  @ApiOkResponse({
    description: 'Image processed successfully'
  })
  @Post('process')
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: UNPROCESSED_IMAGE_PATH,
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  processImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const imageProperties = JSON.parse(body.properties);
    this.logger.debug('image: ', image);
    this.logger.debug('image properties: ', imageProperties);
    return this.processorService.processImage(image, imageProperties);
  }
}
