import { Router } from 'express';
import { query, param, validationResult } from 'express-validator';
import sql from '../db.js';

const router = Router();

router.get('/', [
  query('category').optional().isString().trim().escape(),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { category } = req.query;
    let resources;

    if (category) {
      resources = await sql`
        SELECT * FROM resources WHERE category = ${category} ORDER BY created_at DESC
      `;
    } else {
      resources = await sql`
        SELECT * FROM resources ORDER BY created_at DESC
      `;
    }

    res.json(resources);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const [resource] = await sql`
      SELECT * FROM resources WHERE id = ${req.params.id}
    `;

    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    res.json(resource);
  } catch (err) {
    next(err);
  }
});

export default router;
