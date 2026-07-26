import SiteSettings from '../models/SiteSettings.js';

export const getSettings = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) query.category = category;

    const settings = await SiteSettings.find(query).lean();

    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    res.status(200).json({ success: true, data: settingsObj });
  } catch (err) {
    next(err);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value, category } = req.body;

    const setting = await SiteSettings.findOneAndUpdate(
      { key },
      { key, value, category },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: setting });
  } catch (err) {
    next(err);
  }
};

export const bulkUpdateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    const results = [];

    for (const setting of settings) {
      const result = await SiteSettings.findOneAndUpdate(
        { key: setting.key },
        { key: setting.key, value: setting.value, category: setting.category },
        { new: true, upsert: true, runValidators: true }
      );
      results.push(result);
    }

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};
