import express from 'express';
import { calculateScore, getScoreHistory, getLatestScore, simulateScore } from '../controllers/scoreController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/calculate', calculateScore);
router.post('/simulate', simulateScore);
router.get('/history', getScoreHistory);
router.get('/latest', getLatestScore);

export default router;