import express from 'express';
import { getAllCounselors, addCounselor } from '../components/counselorController.js';

const router = express.Router();

// Route to get the list of all counselors
router.get('/', getAllCounselors);

// Route to add a new counselor
router.post('/', addCounselor);

export default router;
