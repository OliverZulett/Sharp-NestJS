import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ImagesService } from './images.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Post('store-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  storeFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return;
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
            const fileName = uuidv4();
            const fileExt = extname(file.originalname);
            callback(null, `${fileName}${fileExt}`);
          },
        }),
      },
    ),
  )
  storeFiles(
    @UploadedFiles()
    files: {
      file1: Express.Multer.File[];
      file2: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return;
  }

  @Post('process')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const fileName = uuidv4();
          const fileExt = extname(file.originalname);
          callback(null, `${fileName}${fileExt}`);
        },
      }),
    }),
  )
  processFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { body: any },
  ) {
    console.log(file);
    console.log(JSON.parse(body.body));
    return;
  }
}
