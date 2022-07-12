import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { buffer } from 'stream/consumers';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('process')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const fileName = uuidv4();
          callback(null, `${fileName}${fileExtName}`);
        },
      }),
    }),
  )
  processImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    console.log(JSON.parse(body.properties));
    console.log(image);
    return this.imagesService.getStats(
      `${image.destination}/${image.filename}`,
      // return this.imagesService.getMetadata(
      //   `${image.destination}/${image.filename}`,
    );
  }

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Post('store-file')
  @UseInterceptors(
    FileInterceptor(
      'file',
      // {
      //   storage: diskStorage({
      //     destination: './files',
      //     filename: (req, file, callback) => {
      //       const fileExtName = extname(file.originalname);
      //       const fileName = uuidv4();
      //       callback(null, `${fileName}${fileExtName}`);
      //     },
      //   }),
      // }
    ),
  )
  storeFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    this.imagesService.store(file);
    return file;
  }

  @Post('convert-file')
  @UseInterceptors(FileInterceptor('file'))
  convertFormat(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const { format } = JSON.parse(body.properties);
    return this.imagesService.convertToFormat(file, format);
  }

  @Post('store-files')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file1',
          maxCount: 1,
        },
        {
          name: 'file2',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: './files',
          filename: (req, file, callback) => {
            const fileExtName = extname(file.originalname);
            const fileName = uuidv4();
            callback(null, `${fileName}${fileExtName}`);
          },
        }),
      },
    ),
  )
  storeFiles(
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return files;
  }

  @Post('resize-image')
  @UseInterceptors(FileInterceptor('file'))
  resizeImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const { resizeData } = JSON.parse(body.properties);
    return this.imagesService.resizeImage(file, resizeData);
  }

  @Post('crop-image')
  @UseInterceptors(FileInterceptor('file'))
  cropImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const { cropData } = JSON.parse(body.properties);
    return this.imagesService.cropImage(file, cropData);
  }

  @Post('trim-image')
  @UseInterceptors(FileInterceptor('file'))
  trimImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { properties: any },
  ) {
    const { trimThreshold } = JSON.parse(body.properties);
    return this.imagesService.trimImage(file, trimThreshold);
  }
  
  @Post('compose-files')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'baseImage',
          maxCount: 1,
        },
        {
          name: 'image1',
          maxCount: 1,
        },
      ]
    ),
  )
  composeImage(
    @UploadedFiles()
    files: {
      baseImage?: Express.Multer.File[];
      image1?: Express.Multer.File[];
    },
    @Body() body: { properties: any },
  ) {
    console.log(files.image1[0].buffer);
    const { overlayOptions } = JSON.parse(body.properties);
    return this.imagesService.composeImage(files.baseImage[0], files.image1[0], [overlayOptions]);
  }
}
