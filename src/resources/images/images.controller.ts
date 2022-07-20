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
import { diskStorage } from 'multer';
import { ImagesService } from './images.service';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
  })
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'File stored successfully',
  })
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file1: {
          type: 'file',
        },
        file2: {
          type: 'file',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Files stored successfully',
  })
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
        },
        body: {
          type: 'object',
          example: {
            name: 'file name',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'File processed successfully',
  })
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
