import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

export const imageMulterOptions = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new BadRequestException('Only image files allowed'), false);
        return
    }
    cb(null, true);
  },
};
