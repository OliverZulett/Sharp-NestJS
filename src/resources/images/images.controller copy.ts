import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('images')
export class ImagesController {
  private FILES_PATH = './files';

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
          const fileExtName = extname(file.originalname);
          const fileName = uuidv4();
          callback(null, `${fileName}${fileExtName}`);
        },
      }),
    }),
  )
  storeFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }
}
