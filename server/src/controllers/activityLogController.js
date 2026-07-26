import ActivityLog from '../models/ActivityLog.js';

export const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, resource } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (action) query.action = action;
    if (resource) query.resource = resource;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ActivityLog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};
