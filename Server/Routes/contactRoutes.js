import express from 'express';
import { submitContactForm, getContactSubmissions } from '../components/contactController.js';

const router = express.Router();

// Route for submitting the contact form
router.post('/', submitContactForm);

// Route for getting all submissions (for admin)
router.get('/', getContactSubmissions);

export default router;
