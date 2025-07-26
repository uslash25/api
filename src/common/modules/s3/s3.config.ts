import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export function getMulterS3Uploader(options: {
  extensions?: string[];
  maxSize?:    number;
  maxCount?:   number;
}): MulterOptions {
  const allowedExts = options.extensions?.map(ext => ext.toLowerCase());

  return {
    storage: diskStorage({
      destination: './tmp',
      filename:    (req, file, cb) => cb(null, uuidv4()),
    }),
    limits:     { fileSize: options.maxSize ?? undefined },
    fileFilter: (_, file, cb) => {
      const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));

      if (allowedExts && !allowedExts.includes(ext)) {
        return cb(new BadRequestException(`File type not allowed: ${ext}`), false);
      }

      cb(null, true);
    },
  };
}
