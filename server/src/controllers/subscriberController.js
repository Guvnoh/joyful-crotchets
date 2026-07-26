import Subscriber from '../models/Subscriber.js';
import ErrorResponse from '../utils/errorResponse.js';

export const subscribe = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (!subscriber.isActive) {
        subscriber.isActive = true;
        subscriber.unsubscribedAt = undefined;
        await subscriber.save();
        return res.status(200).json({ success: true, message: 'Welcome back! You have been resubscribed.' });
      }
      return next(new ErrorResponse('Email is already subscribed', 400));
    }

    subscriber = await Subscriber.create({ email, name });
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter', data: subscriber });
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return next(new ErrorResponse('Email not found in subscribers', 404));
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({ success: true, message: 'Successfully unsubscribed from newsletter' });
  } catch (err) {
    next(err);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const subscribers = await Subscriber.find(query)
      .sort('-subscribedAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Subscriber.countDocuments(query);

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};
