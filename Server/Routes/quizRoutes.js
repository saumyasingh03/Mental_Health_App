const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// Route 1: To get all the questions for the quiz
// Method: GET
// Endpoint: /api/quiz/questions
router.get('/questions', quizController.getQuizQuestions);


// Route 2: To submit the answers after the quiz is completed
// Method: POST
// Endpoint: /api/quiz/submit
router.post('/submit', protect, quizController.submitQuiz);


module.exports = router;