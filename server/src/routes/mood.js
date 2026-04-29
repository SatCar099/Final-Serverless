import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import sql from '../db.js';

const router = Router();

const VALID_MOODS = ['great', 'good', 'okay', 'bad', 'terrible', 'happy', 'calm', 'sad', 'anxious', 'angry'];

router.post('/', [
  body('sessionId').isString().trim().notEmpty().withMessage('sessionId is required'),
  body('mood')
    .isString().trim().notEmpty()
    .isIn(VALID_MOODS).withMessage(`mood must be one of: ${VALID_MOODS.join(', ')}`),
  body('note').optional().isString().trim().isLength({ max: 1000 }).escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { sessionId, mood, note = null } = req.body;

    const [entry] = await sql`
      INSERT INTO mood_entries (session_id, mood, note)
      VALUES (${sessionId}, ${mood}, ${note})
      RETURNING *
    `;

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

router.get('/:sessionId', [
  param('sessionId').isString().trim().notEmpty().withMessage('sessionId is required'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const entries = await sql`
      SELECT * FROM mood_entries
      WHERE session_id = ${req.params.sessionId}
      ORDER BY created_at DESC
    `;

    res.json(entries);
  } catch (err) {
    next(err);
  }
});

export default router;
