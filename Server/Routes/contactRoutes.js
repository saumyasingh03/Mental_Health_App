const express = require('express');
const router = express.Router();
const { submitContactForm, getContactSubmissions } = require('../controllers/contactController');

// Route for submitting the contact form
router.post('/', submitContactForm);

// Route for getting all submissions (for admin)
router.get('/', getContactSubmissions);

module.exports = router;