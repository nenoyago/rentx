import crypto from 'crypto';
import { resolve } from 'path';

import multer from 'multer';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (_, file, callback) => {
      const fileHash = crypto.randomBytes(16).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
