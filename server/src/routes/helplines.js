import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import sql from '../db.js';

const router = Router();

router.get('/', [
  query('country').optional().isString().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { country } = req.query;
    let helplines;

    if (country) {
      helplines = await sql`
        SELECT * FROM helplines
        WHERE LOWER(country) = LOWER(${country})
        ORDER BY country ASC
      `;
    } else {
      helplines = await sql`
        SELECT * FROM helplines ORDER BY country ASC
      `;
    }

    res.json(helplines);
  } catch (err) {
    next(err);
  }
});

export default router;
