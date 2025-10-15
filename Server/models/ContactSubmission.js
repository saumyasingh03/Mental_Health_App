const mongoose = require('mongoose');
const { Schema } = mongoose;
const ContactSubmissionSchema = new Schema({
    
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, 
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
  },


  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const ContactSubmission = mongoose.model('ContactSubmission', ContactSubmissionSchema);

module.exports = ContactSubmission;