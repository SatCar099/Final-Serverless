import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import sql from '../db.js';

const router = Router();

router.post('/', [
  body('sessionId').isString().trim().notEmpty().withMessage('sessionId is required'),
  body('score').isInt({ min: 0 }).withMessage('score must be a non-negative integer'),
  body('answers').isObject().withMessage('answers must be an object'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { sessionId, score, answers } = req.body;

    const [result] = await sql`
      INSERT INTO quiz_results (session_id, score, answers_json)
      VALUES (${sessionId}, ${score}, ${JSON.stringify(answers)})
      RETURNING *
    `;

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
