const QuizResponse = require('../models/QuizResponse');

// --- Data for the 10 questions ---
// Isko hum baad me database se bhi la sakte hain, abhi ke liye simple rakhte hain.
const questions = [
  {
    id: 1,
    text: 'Pichle 2 hafto me, aap kitni baar kaam me mann na lagne ya udaas mehsus karne se pareshan rahe hain?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 2,
    text: 'Pichle 2 hafto me, kitni baar aapko cheezon me anand ya dilchaspi kam mehsus hui?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 3,
    text: 'Aapko neend aane me ya sote rehne me kitni pareshani hui?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 4,
    text: 'Aap kitni baar thaka hua ya kam energy wala mehsus karte hain?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 5,
    text: 'Aapki bhookh kam ya zyada hui hai?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 6,
    text: 'Aap kitni baar apne baare me bura mehsus karte hain ya khud ko doshi maante hain?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 7,
    text: 'Aapko cheezon par focus karne me kitni mushkil hoti hai, jaise akhbaar padhna ya TV dekhna?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 8,
    text: 'Kya aap itna dheere chalte ya bolte hain ki dusre log notice kar saken? Ya iska ulta - itne bechain rehte hain ki सामान्य se zyada ghoomte rehte hain?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 9,
    text: 'Kitni baar aapke mann me khayal aaya ki aap mar jaate to behtar hota, ya aap khud ko nuksaan pahunchana chahte hain?',
    options: [
      { id: 0, text: 'Bilkul nahi' },
      { id: 1, text: 'Kuch din' },
      { id: 2, text: 'Aadhe se zyada din' },
      { id: 3, text: 'Lagbhag har din' },
    ],
  },
  {
    id: 10,
    text: 'In pareshaniyon ki vajah se aapko apne kaam, ghar ya logon ke saath milne-julne me kitni mushkil hui hai?',
    options: [
      { id: 0, text: 'Bilkul mushkil nahi' },
      { id: 1, text: 'Thodi mushkil' },
      { id: 2, text: 'Bahut mushkil' },
      { id: 3, text: 'Atyant mushkil' },
    ],
  },
];


// Function to get all quiz questions
exports.getQuizQuestions = (req, res) => {
  try {
    // We just send the hardcoded questions array
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};


// Function to submit quiz answers
exports.submitQuiz = async (req, res) => {
  const { answers } = req.body; // Expecting an array of 10 numbers like [1, 2, 0, 3, ...]

  // --- Basic Validation ---
  if (!answers || !Array.isArray(answers) || answers.length !== 10) {
    return res.status(400).json({ message: 'Please provide 10 answers.' });
  }

  try {
    // --- Scoring Logic (Simple Sum) ---
    const score = answers.reduce((total, current) => total + current, 0);

    // --- Categorization Logic ---
    let category = 'none';
    let dailyPlan = [];
    
    // (Total possible score is 30, since each of 10 questions has max value 3)
    if (score >= 1 && score <= 9) {
      category = 'mild';
      dailyPlan = [
        "Aaj 15 minute ke liye halki walk par jaayein.",
        "Apne pasand ka koi gaana sunein.",
        "Raat ko sone se pehle 3 aisi cheezein sochein jinke liye aap shukraguzar hain."
      ];
    } else if (score >= 10 && score <= 19) {
      category = 'moderate';
      dailyPlan = [
        "Aaj 20 minute tak aisi exercise karein jisse halka pasina aaye (jaise jogging ya cycling).",
        "Kisi dost ya parivaar ke sadasya se 10 minute baat karein.",
        "Apne din ko plan karne ke liye ek choti to-do list banayein."
      ];
    } else if (score >= 20) {
      category = 'severe';
      dailyPlan = [
        "Yeh zaroori hai ki aap kisi professional se salah lein. Humne aapke liye kuch helpline numbers diye hain.",
        "Aaj 5 minute ke liye gehri saans lene ki practice karein.",
        "Ek surakshit aur shaant jagah par thoda samay bitayein."
      ];
    } else {
        category = 'none';
        dailyPlan = [
            "Aapka score bahut accha hai! Apni mental health ko aise hi maintain karein.",
            "Aaj kuch naya seekhne ki koshish karein.",
            "Apni kisi hobby ke liye samay nikalein."
        ];
    }


    // --- Save to Database ---
    const newResponse = new QuizResponse({
      answers,
      score,
      category,
      user: req.user.id, // <-- YEH LINE ADD KARO (req.user middleware se aayega)
    });
    await newResponse.save();

    // --- Send Response to Frontend ---
    res.status(201).json({
      message: 'Quiz submitted successfully!',
      score,
      category,
      dailyPlan,
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error, please try again.' });
  }
};