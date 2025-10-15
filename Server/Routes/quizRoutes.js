import express from 'express';
import { getQuizQuestions, submitQuiz } from '../components/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route 1: To get all the questions for the quiz
// Method: GET
// Endpoint: /api/quiz/questions
router.get('/questions', getQuizQuestions);

// Route 2: To submit the answers after the quiz is completed
// Method: POST
// Endpoint: /api/quiz/submit
router.post('/submit', protect, submitQuiz);

export default router;
