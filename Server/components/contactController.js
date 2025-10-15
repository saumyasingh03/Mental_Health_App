import ContactSubmission from '../models/ContactSubmission.js';

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // --- Simple validation ---
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill all the fields.' });
    }

    // --- Create a new submission instance ---
    const newSubmission = new ContactSubmission({
      name,
      email,
      message,
    });

    // --- Save to database ---
    await newSubmission.save();

    // --- Send success response ---
    res.status(201).json({ message: 'Thank you for your message! We will get back to you soon.' });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Something went wrong on the server. Please try again.' });
  }
};

// @desc    Get all contact submissions (for Admin in the future)
// @route   GET /api/contact
// @access  Private (Admin only)
export const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await ContactSubmission.find({}).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error while fetching submissions.' });
  }
};
