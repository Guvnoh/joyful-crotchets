import ActivityLog from '../models/ActivityLog.js';

export const logActivity = (action, resource) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = async function (body) {
      if (res.statusCode < 400 && req.user) {
        const resourceId = req.params.id || req.body?._id || body?.data?._id;
        await ActivityLog.create({
          user: req.user._id,
          action,
          resource,
          resourceId: resourceId || undefined,
          description: `${action} ${resource}${resourceId ? ` (${resourceId})` : ''}`,
          ip: req.ip,
          userAgent: req.headers['user-agent'],
        }).catch(() => {});
      }
      return originalJson(body);
    };
    next();
  };
};
