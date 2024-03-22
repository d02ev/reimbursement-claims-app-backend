import multer from 'multer';
import FileUploadError from '../errors/fileUpload.error';
import { FILE_UPLOAD_ERROR_CODES } from '../constants/error.codes';

const storage = multer.memoryStorage({});

const upload = multer({
  storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
    files: 1,
  },
  fileFilter(req, file, cb) {
    const allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new FileUploadError(
          'Only JPG/JPEG, PNG and PDF files are allowed',
          FILE_UPLOAD_ERROR_CODES.ALLOWED_MIMETYPE_MISMATCH,
          null,
          null,
        ),
        false,
      );
    }
  },
});

export default upload;
