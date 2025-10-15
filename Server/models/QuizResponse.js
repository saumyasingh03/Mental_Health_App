const mongoose = require('mongoose');
const { Schema } = mongoose;


const QuizResponseSchema = new Schema({


  user: { // <-- YEH POORA OBJECT ADD KARO
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
 
  answers: {
    type: [Number],
    required: true,
  },

 
  score: {
    type: Number,
    required: true,
  },

  
  category: {
    type: String,
    required: true,
    enum: ['mild', 'moderate', 'severe', 'none'], 
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuizResponse = mongoose.model('QuizResponse', QuizResponseSchema);

module.exports = QuizResponse;