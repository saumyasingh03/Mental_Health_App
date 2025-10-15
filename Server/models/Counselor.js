import mongoose from 'mongoose';
const { Schema } = mongoose;

const CounselorSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Counselor name is required'],
    trim: true,
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    // Example: "Depression, Anxiety", "Relationship Counseling", etc.
  },
  bio: {
    type: String,
    required: [true, 'A short bio is required'],
    maxLength: 500,
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  imageUrl: {
    type: String, // URL to the counselor's profile picture
    default: 'https://i.ibb.co/61LdwW4/user-default.png', // Default image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Counselor = mongoose.model('Counselor', CounselorSchema);

export default Counselor;
