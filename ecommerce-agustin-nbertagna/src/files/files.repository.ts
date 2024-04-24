import { Injectable } from '@nestjs/common';
import {
  v2,
  UploadApiResponse,
  UploadStream,
  UploadApiErrorResponse,
} from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class FilesRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload: UploadStream = v2.uploader.upload_stream(
        { resource_type: 'auto' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) reject(error);
          if (result) resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
