
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); 
const connectDB = require('./config/db'); 


dotenv.config(); 
const app = express();
const PORT = process.env.PORT || 4000;


connectDB();


app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true,
  })
);

app.use(helmet()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.send('API is running...');
});


const cookieParser = require('cookie-parser'); 
const authRoutes = require('./routes/authRoutes'); 

app.use(cookieParser()); 


app.use('/api/auth', authRoutes); 

const quizRoutes = require('./routes/quizRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const contactRoutes = require('./routes/contactRoutes'); 

app.use('/api/quiz', quizRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/contact', contactRoutes); 



app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});