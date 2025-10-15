const Counselor = require('../models/Counselor');

// @desc    Get all counselors
// @route   GET /api/counselors
// @access  Public
exports.getAllCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find({});
    res.status(200).json(counselors);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    res.status(500).json({ message: 'Server error while fetching counselors.' });
  }
};

// @desc    Add a new counselor
// @route   POST /api/counselors
// @access  Private (in future, this will be admin-only)
exports.addCounselor = async (req, res) => {
  try {
    const { name, specialization, bio, contactNumber, imageUrl } = req.body;

    // Simple validation
    if (!name || !specialization || !bio || !contactNumber) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newCounselor = new Counselor({
      name,
      specialization,
      bio,
      contactNumber,
      imageUrl, // Optional
    });

    const savedCounselor = await newCounselor.save();
    res.status(201).json({ message: 'Counselor added successfully!', counselor: savedCounselor });

  } catch (error) {
    console.error('Error adding counselor:', error);
    res.status(500).json({ message: 'Server error while adding a counselor.' });
  }
};