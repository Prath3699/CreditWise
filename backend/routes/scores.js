import express from 'express';
import { calculateScore, getScoreHistory, getLatestScore } from '../controllers/scoreController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/calculate', calculateScore);
router.get('/history', getScoreHistory);
router.get('/latest', getLatestScore);

export default router;