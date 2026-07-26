import { seed } from '../seeds/seed.js';

export const runSeed = async (req, res, next) => {
  try {
    const result = await seed();
    res.status(200).json({ success: true, message: 'Database seeded successfully', data: result });
  } catch (err) {
    next(err);
  }
};
