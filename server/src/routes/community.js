import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import sql from '../db.js';

const router = Router();

const communityPostLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many posts. Please wait a minute before posting again.' },
});

router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt().withMessage('limit must be between 1 and 50'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const offset = (page - 1) * limit;

    const [{ count }] = await sql`SELECT COUNT(*) FROM community_posts`;
    const posts = await sql`
      SELECT * FROM community_posts
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.json({
      posts,
      pagination: {
        total: Number(count),
        page,
        limit,
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', communityPostLimiter, [
  body('nickname')
    .isString().trim().notEmpty().withMessage('nickname is required')
    .isLength({ min: 2, max: 50 }).withMessage('nickname must be 2–50 characters')
    .escape(),
  body('message')
    .isString().trim().notEmpty().withMessage('message is required')
    .isLength({ min: 5, max: 1000 }).withMessage('message must be 5–1000 characters')
    .escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { nickname, message } = req.body;

    const [post] = await sql`
      INSERT INTO community_posts (nickname, message)
      VALUES (${nickname}, ${message})
      RETURNING *
    `;

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
});

export default router;
