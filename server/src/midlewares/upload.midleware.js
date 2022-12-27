import multer from 'multer';
import mime from 'mime-types';
import { v4 as uuid } from 'uuid';

const storage = multer.diskStorage({
  destination: 'public/',
  filename: (req, file, cb) => {
    const uniqueSuffix = uuid();
    const ext = mime.extension(file.mimetype);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

export default upload;
