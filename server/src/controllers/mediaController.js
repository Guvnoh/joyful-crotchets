import cloudinary from '../config/cloudinary.js';

export const getMedia = async (req, res, next) => {
  try {
    const folder = req.query.folder || 'joyful-crotchets/uploads';
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const media = (result.resources || []).map((r) => ({
      _id: r.public_id,
      url: r.secure_url,
      publicId: r.public_id,
      filename: r.public_id.split('/').pop(),
      mimetype: `image/${r.format}`,
      size: r.bytes,
      createdAt: r.created_at,
    }));

    res.status(200).json({ success: true, data: media });
  } catch (err) {
    res.status(200).json({ success: true, data: [] });
  }
};
