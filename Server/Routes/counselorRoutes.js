const express = require('express');
const router = express.Router();
const { getAllCounselors, addCounselor } = require('../controllers/counselorController');

// Route to get the list of all counselors
router.get('/', getAllCounselors);

// Route to add a new counselor
router.post('/', addCounselor);

module.exports = router;