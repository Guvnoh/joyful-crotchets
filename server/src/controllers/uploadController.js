import cloudinary from '../config/cloudinary.js';
import ErrorResponse from '../utils/errorResponse.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    const b64 = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const folder = req.body.folder || 'joyful-crotchets/uploads';
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload at least one file', 400));
    }

    const folder = req.body.folder || 'joyful-crotchets/uploads';
    const uploaded = [];

    for (const file of req.files) {
      const b64 = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder,
        transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
      });

      uploaded.push({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    res.status(200).json({ success: true, data: uploaded });
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return next(new ErrorResponse('Please provide a public ID', 400));
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return next(new ErrorResponse('Failed to delete image', 400));
    }

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    next(err);
  }
};
