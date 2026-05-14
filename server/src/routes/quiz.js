import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import sql from '../db.js';

const router = Router();

// PHQ-9 style: 9 questions, each scored 0–3. Total 0–27.
const QUESTION_COUNT = 9;
const MAX_ANSWER_VALUE = 3;

function calcScore(answers) {
  return Object.values(answers).reduce((sum, v) => sum + Number(v), 0);
}

function getInterpretation(score) {
  if (score <= 4) return 'Minimal or no depression';
  if (score <= 9) return 'Mild depression';
  if (score <= 14) return 'Moderate depression';
  if (score <= 19) return 'Moderately severe depression';
  return 'Severe depression';
}

router.post('/', [
  body('sessionId').isString().trim().notEmpty().withMessage('sessionId is required'),
  body('answers')
    .isObject().withMessage('answers must be an object')
    .custom((answers) => {
      const vals = Object.values(answers);
      if (vals.length === 0) throw new Error('answers must not be empty');
      if (vals.length > QUESTION_COUNT) throw new Error(`answers must have at most ${QUESTION_COUNT} entries`);
      if (!vals.every((v) => Number.isInteger(Number(v)) && Number(v) >= 0 && Number(v) <= MAX_ANSWER_VALUE)) {
        throw new Error(`each answer must be an integer between 0 and ${MAX_ANSWER_VALUE}`);
      }
      return true;
    }),
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { sessionId, answers } = req.body;
    const score = calcScore(answers);

    const [result] = await sql`
      INSERT INTO quiz_results (session_id, score, answers_json)
      VALUES (${sessionId}, ${score}, ${sql.json(answers)})
      RETURNING *
    `;

    res.status(201).json({
      ...result,
      interpretation: getInterpretation(score),
      disclaimer: 'This is a general wellness screening tool, not a medical diagnosis. Please consult a qualified healthcare professional.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
