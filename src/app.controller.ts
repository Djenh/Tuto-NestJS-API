import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { fileNameEditor, imageFileFilter } from './files/file.utils';
import { createFileDto } from './files/create-file.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: fileNameEditor,
        destination: join(process.cwd(), 'src', 'public', 'files')
      }),
      limits: {
        fileSize: 1024 * 1024*10, //10MB
      },
      fileFilter: imageFileFilter,
    })
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: createFileDto){
    return {
      filename: file.filename,
      size: file.size,
      dto
    }
  }
}
