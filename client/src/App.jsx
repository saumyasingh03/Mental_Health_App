import React, { useState, useMemo, useEffect } from 'react';
import Face from "./components/face";
import ChatBot from "./components/chatbot";
import { LogIn, UserPlus, Heart, Zap, MessageCircle, User, MessageSquare, Briefcase, ChevronRight, CheckCircle, Home, LayoutDashboard, Settings } from 'lucide-react';

// --- Global Constants ---
const QUIZ_QUESTIONS = [
  { id: 1, text: "Little interest or pleasure in doing things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 2, text: "Feeling down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 4, text: "Feeling tired or having little energy?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 5, text: "Poor appetite or overeating?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 6, text: "Feeling bad about yourself—or that you are a failure or have let yourself or your family down?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite—being so fidgety or restless that you have been moving around a lot more than usual?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 9, text: "Thoughts that you would be better off dead, or of hurting yourself in some way?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
];

const INITIAL_USER = { name: "Alex", email: "alex@example.com", userId: "user-12345" };

const App = () => {
  // --- State Management for Application Flow ---
  const [currentPage, setCurrentPage] = useState('landing'); // landing, login, signup, quiz, dashboard, community, counselor, profile
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);
  const [quizResult, setQuizResult] = useState(null); // null, 'mild', 'moderate', 'severe'

  // --- Quiz State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const [showFaceModal, setShowFaceModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);


  // --- Auth & Navigation Logic ---
  const handleAuth = (type) => {
    // Placeholder for actual JWT/Firebase Auth logic
    console.log(`${type} attempted`);
    setIsAuthenticated(true);
    setUser(INITIAL_USER);
    
    // After successful login, redirect to dashboard or quiz (if result is null)
    if (quizResult) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('quiz');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser({});
    setQuizResult(null);
    setCurrentPage('landing');
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizSubmitted(false);
  };
  
  const setPage = (page) => {
      // Emergency check for unauthenticated access to protected pages
      if (['dashboard', 'community', 'counselor', 'profile'].includes(page) && !isAuthenticated) {
          return setCurrentPage('login');
      }
      setCurrentPage(page);
  };

  // --- Quiz Logic ---
  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    setIsQuizSubmitted(true);
    // Placeholder for ML Model Prediction
    // Based on scores (e.g., 0=Not at all, 3=Nearly every day)
    const score = Object.values(quizAnswers).reduce((sum, answer) => {
        const index = QUIZ_QUESTIONS[0].options.indexOf(answer);
        return sum + (index >= 0 ? index : 0);
    }, 0);

    let result = 'mild';
    if (score >= 10 && score <= 14) result = 'moderate';
    if (score >= 15) result = 'severe';

    setTimeout(() => {
      setQuizResult(result);
      setCurrentPage('dashboard');
      setIsQuizSubmitted(false);
    }, 2000); // Simulate ML processing time
  };

  // --- Derived State for UI Colors/Content ---
  const {bgColor, resultText, message} = useMemo(() => {
    switch (quizResult) {
      case 'mild':
        return {
          bgColor: 'bg-green-500',
          resultText: 'Mild',
          message: 'You have a mild risk level. We suggest focusing on daily gratitude and mindfulness exercises to maintain your well-being.'
        };
      case 'moderate':
        return {
          bgColor: 'bg-yellow-500',
          resultText: 'Moderate',
          message: 'Your current risk level is moderate. We highly recommend utilizing the peer support circles and reviewing your personalized plan daily.'
        };
      case 'severe':
        return {
          bgColor: 'bg-red-500',
          resultText: 'Severe',
          message: 'Your current risk level is severe. Please use the "Counselor Connect" feature immediately and reach out to an emergency service if necessary.'
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          resultText: 'Pending',
          message: 'Please complete the onboarding quiz to get your personalized plan.'
        };
    }
  }, [quizResult]);




  // --- UI Components Start Here ---

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold text-indigo-600 cursor-pointer flex items-center"
          onClick={() => setPage("landing")}
        >
          <Heart className="inline-block w-6 h-6 mr-1" />
          Mentify
        </h1>

        {/* Navbar */}
        <nav className="hidden md:flex space-x-4 items-center">
          {!isAuthenticated ? (
            <>
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setPage("landing")}
              >
                Home
              </button>
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setPage("community")}
              >
                Stories
              </button>
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setPage("contact")}
              >
                Support
              </button>

              {/* Emotion Detector (Modal) */}
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => {
                  setShowFaceModal(true);
                  setShowChatModal(false);
                }}
              >
                Emotion Detector
              </button>

              {/* Chat with Mentor (Modal) */}
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => {
                  setShowChatModal(true);
                  setShowFaceModal(false);
                }}
              >
                Chat with Mentor
              </button>

              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-600 transition duration-200"
                onClick={() => setPage("login")}
              >
                Login
              </button>
              <button
                className="bg-transparent border border-indigo-500 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50 transition duration-200"
                onClick={() => setPage("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setPage("community")}
              >
                Community
              </button>
              <button
                className="text-gray-600 hover:text-indigo-600 font-medium"
                onClick={() => setPage("profile")}
              >
                Profile
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition duration-200 flex items-center"
                onClick={handleLogout}
              >
                <LogIn className="w-4 h-4 mr-2" /> Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu (optional) */}
        <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Face Modal */}
      {showFaceModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="text-red-500 absolute top-2 right-3 text-xl font-bold"
              onClick={() => setShowFaceModal(false)}
            >
              &times;
            </button>
            <Face />
          </div>
        </div>
      )}

      {/* ChatBot Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-[60]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="text-red-500 absolute top-2 right-3 text-xl font-bold"
              onClick={() => setShowChatModal(false)}
            >
              &times;
            </button>
            <ChatBot />
          </div>
        </div>
      )}
    </header>
);



  const LandingPage = () => (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center py-16 bg-white rounded-3xl shadow-xl mb-16 border-t-8 border-indigo-500">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Find Your <span className="text-indigo-600">Inner Balance</span>
          </h2>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Personalized support, peer connection, and professional guidance to foster your mental wellness journey.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              className="px-8 py-3 text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl transform hover:scale-105 transition duration-300"
              onClick={() => setPage('quiz')}
            >
              <Zap className="w-5 h-5 inline-block mr-2" /> Take Your First Step
            </button>
            <button
              className="px-8 py-3 text-lg font-semibold rounded-full text-indigo-600 border-2 border-indigo-600 bg-white hover:bg-indigo-50 transform hover:scale-105 transition duration-300"
              onClick={() => setPage('login')}
            >
              <LogIn className="w-5 h-5 inline-block mr-2" /> Already a Member?
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon={<Heart className="w-8 h-8 text-indigo-500" />}
            title="Personalized Plans"
            description="Our AI-powered quiz predicts your needs and creates a custom daily schedule of micro-tasks."
          />
          <FeatureCard 
            icon={<MessageCircle className="w-8 h-8 text-indigo-500" />}
            title="Peer Recovery Circles"
            description="Connect anonymously with a supportive community. Read shared stories and find strength in unity."
          />
          <FeatureCard 
            icon={<Briefcase className="w-8 h-8 text-indigo-500" />}
            title="Counselor Connect"
            description="For moderate and severe levels, get quick access to resources and professional counseling options."
          />
        </div>

        {/* Support Section */}
        <div className="mt-20 text-center">
            <h3 className="text-3xl font-bold text-gray-900">Need Help Now?</h3>
            <p className="mt-4 text-gray-600">If you are in crisis, please seek immediate help.</p>
            <div className="mt-6 flex justify-center space-x-6">
                <p className="text-xl font-semibold text-red-600">Crisis Text Line: Text HOME to 741741</p>
                <p className="text-xl font-semibold text-red-600">National Lifeline: Call 988</p>
            </div>
        </div>

      </div>
    </div>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-indigo-100 rounded-xl">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-4 text-gray-500">{description}</p>
    </div>
  );

  const AuthForm = ({ type }) => {
    const isLogin = type === 'login';
    const title = isLogin ? 'Welcome Back' : 'Create Account';
    const buttonText = isLogin ? 'Login' : 'Sign Up';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAuth(type);
    };

    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">{title}</h2>
          <p className="text-center text-gray-500 mb-8">Join the journey to better mental health.</p>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
              placeholder="********"
              required
            />
            {isLogin && (
                <a href="#" className="text-xs text-indigo-500 hover:text-indigo-600 float-right mt-1">Forgot Password?</a>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 transform hover:scale-[1.01]"
          >
            {buttonText}
          </button>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
              onClick={() => setPage(isLogin ? 'signup' : 'login')}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    );
  };

  const QuizScreen = () => {
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1;
    const isAnswered = quizAnswers[currentQuestion.id] !== undefined;

    if (isQuizSubmitted) {
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-indigo-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-xl max-w-sm">
            <Zap className="w-12 h-12 mx-auto text-indigo-500 animate-pulse" />
            <h2 className="text-2xl font-bold mt-4 text-gray-800">Analyzing Your Responses...</h2>
            <p className="text-gray-500 mt-2">The AI is predicting your current well-being level.</p>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-indigo-500">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Onboarding Check-up</h2>
          <div className="text-sm text-indigo-600 font-medium mb-6">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
              <p className="text-xl font-semibold text-gray-700">
                {currentQuestion.text}
              </p>
          </div>

          <div className="mt-6 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition duration-150 border-2 ${
                  quizAnswers[currentQuestion.id] === option
                    ? 'bg-indigo-100 border-indigo-600 text-indigo-800 shadow-md'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={`q-${currentQuestion.id}`}
                  value={option}
                  checked={quizAnswers[currentQuestion.id] === option}
                  onChange={() => handleQuizAnswer(currentQuestion.id, option)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 mr-4"
                />
                <span className="font-medium">{option}</span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={goToPrevQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-full font-semibold transition duration-200 flex items-center ${
                currentQuestionIndex === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <ChevronRight className="w-5 h-5 mr-2 transform rotate-180" /> Back
            </button>

            {isLastQuestion ? (
              <button
                onClick={submitQuiz}
                disabled={!isAnswered}
                className={`px-8 py-3 rounded-full font-semibold text-white transition duration-200 flex items-center ${
                  !isAnswered
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg'
                }`}
              >
                Submit & Get Plan
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={!isAnswered}
                className={`px-6 py-3 rounded-full font-semibold transition duration-200 flex items-center ${
                  !isAnswered
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
                }`}
              >
                Next Question <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <div className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white shadow-xl p-4 hidden lg:block">
      <nav className="space-y-2">
        <SidebarItem icon={<LayoutDashboard />} label="Dashboard" page="dashboard" current={currentPage} setPage={setPage} />
        <SidebarItem icon={<MessageSquare />} label="Community Circles" page="community" current={currentPage} setPage={setPage} />
        <SidebarItem icon={<Briefcase />} label="Counselor Connect" page="counselor" current={currentPage} setPage={setPage} />
        <SidebarItem icon={<User />} label="Profile & History" page="profile" current={currentPage} setPage={setPage} />
        <SidebarItem icon={<Settings />} label="Contact & Support" page="contact" current={currentPage} setPage={setPage} />
      </nav>
      {quizResult === 'severe' && (
        <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
            <p className="text-sm font-semibold text-red-700">Immediate Action:</p>
            <button
                onClick={() => setPage('counselor')}
                className="w-full mt-2 text-red-600 bg-red-200 hover:bg-red-300 py-2 rounded-lg font-bold text-sm transition"
            >
                CONNECT COUNSELOR
            </button>
        </div>
      )}
    </div>
  );

  const SidebarItem = ({ icon, label, page, current, setPage }) => {
    const isActive = current === page;
    return (
      <button
        onClick={() => setPage(page)}
        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition duration-200 font-medium ${
          isActive
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const Dashboard = () => {
    const dailyTasks = [
      { id: 1, text: "5-Minute Guided Breathing Session", completed: false },
      { id: 2, text: "Write 3 things you're grateful for (Journal)", completed: true },
      { id: 3, text: "Light physical activity (15 mins)", completed: false },
      { id: 4, text: "Connect with a friend or family member", completed: false },
      { id: 5, text: "Read a chapter of a book", completed: true },
    ];

    const completedCount = dailyTasks.filter(t => t.completed).length;

    return (
      <div className="lg:ml-64 pt-24 p-4 lg:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Hello, {user.name}!</h2>
        <p className="text-gray-500 mb-8">This is your personalized roadmap to well-being.</p>

        {/* Status Card */}
        <div className={`p-6 rounded-2xl shadow-xl mb-8 text-white ${bgColor}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-light">Current Well-being Level (Based on Quiz)</p>
              <h3 className="text-3xl font-extrabold mt-1">{resultText} Risk</h3>
            </div>
            <Heart className="w-8 h-8" />
          </div>
          <p className="mt-4 text-sm font-medium">{message}</p>
          {quizResult === 'severe' && (
            <button onClick={() => setPage('counselor')} className="mt-4 text-sm font-bold bg-white text-red-600 px-4 py-2 rounded-full hover:bg-gray-100 transition">
                <Briefcase className="w-4 h-4 inline-block mr-2" /> Connect Immediately
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Daily Plan / Micro-Tasks */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex justify-between items-center">
                    Daily Plan 
                    <span className="text-sm font-semibold text-indigo-600">{completedCount}/{dailyTasks.length} Completed</span>
                </h3>
                <div className="space-y-3">
                    {dailyTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
                <div className="mt-6 flex justify-between space-x-3">
                    <button className="flex-1 bg-indigo-500 text-white py-3 rounded-xl hover:bg-indigo-600 transition font-semibold">
                        Start Breathing Session
                    </button>
                    <button className="flex-1 border border-indigo-500 text-indigo-600 py-3 rounded-xl hover:bg-indigo-50 transition font-semibold">
                        Gratitude Journal
                    </button>
                </div>
            </div>

            {/* Mood Trend & Community Widget */}
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Mood Trend (7 Days)</h3>
                    {/* Placeholder for a simple graph/chart visualization */}
                    <div className="h-32 bg-gray-100 rounded-lg flex items-end justify-between p-2">
                        {/* Mock data points for visual representation */}
                        {[80, 50, 70, 90, 40, 60, 75].map((h, i) => (
                            <div key={i} className="w-1/8 mx-1 bg-indigo-400 rounded-t-full transition-all duration-500" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-2">Mood Log Score (1-10)</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Peer Circle Spotlight</h3>
                    <p className="text-sm text-gray-600 italic">
                        "I'm finally starting to see light at the end of the tunnel. Keep going, you've got this."
                    </p>
                    <button onClick={() => setPage('community')} className="w-full mt-4 text-indigo-600 border border-indigo-200 py-2 rounded-xl hover:bg-indigo-50 transition font-semibold">
                        <MessageCircle className="w-4 h-4 inline-block mr-2" /> Join Discussion
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }) => (
    <div className={`flex items-center p-4 rounded-xl transition duration-150 border-2 ${
        task.completed 
            ? 'bg-green-50 border-green-300' 
            : 'bg-gray-50 border-gray-200 hover:bg-indigo-50'
        }`}>
      <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
          task.completed ? 'bg-green-500' : 'bg-gray-400'
        }`}>
        {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
      <span className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{task.text}</span>
    </div>
  );

  const CommunityPage = () => {
    const stories = [
      { id: 1, alias: "HopefulStar_77", content: "I started small—just one minute of deep breathing a day. Now I'm up to ten! Consistency is key. You can do it!", supports: 45, comments: 12 },
      { id: 2, alias: "Quiet_Achiever", content: "It took me months to finally talk to a professional, but it was the best decision. Don't be afraid to seek help.", supports: 68, comments: 20 },
      { id: 3, alias: "Sunrise_Seeker", content: "Gratitude journaling really changed my perspective. Even on hard days, there's always one small good thing to note down.", supports: 31, comments: 5 },
    ];
    
    const [newPost, setNewPost] = useState('');

    const handlePostSubmit = (e) => {
        e.preventDefault();
        // Placeholder for adding post to Firestore
        console.log("New Post Submitted:", newPost);
        setNewPost('');
    };

    return (
      <div className="lg:ml-64 pt-24 p-4 lg:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Peer Recovery Circles</h2>
        <p className="text-gray-500 mb-8">Share stories and find support anonymously. Remember: Be kind and supportive.</p>

        {/* New Post Form */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
            <h3 className="text-xl font-bold text-gray-700 mb-3">Share Your Story or Message</h3>
            <form onSubmit={handlePostSubmit}>
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    placeholder="What's on your mind today? Share an achievement, a struggle, or a helpful tip."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    required
                ></textarea>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-red-500 font-medium">Your identity is hidden: {user.userId.substring(0, 8)}...</p>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
                    >
                        Post Anonymously
                    </button>
                </div>
            </form>
        </div>

        {/* Story Feed */}
        <div className="space-y-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    );
  };

  const StoryCard = ({ story }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">{story.alias}</span>
        <span className="text-xs text-gray-400">2 hours ago</span>
      </div>
      <p className="text-gray-700 leading-relaxed mb-4">{story.content}</p>
      <div className="flex space-x-4 text-gray-500 text-sm">
        <button className="flex items-center hover:text-red-500 transition">
          <Heart className="w-4 h-4 mr-1" /> {story.supports} Supports
        </button>
        <button className="flex items-center hover:text-indigo-500 transition">
          <MessageCircle className="w-4 h-4 mr-1" /> {story.comments} Comments
        </button>
      </div>
    </div>
  );

  const CounselorConnectPage = () => {
    const isModerateOrSevere = quizResult === 'moderate' || quizResult === 'severe';
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => { setIsSubmitted(false); console.log("Counselor Form Submitted"); }, 3000);
    };

    return (
      <div className="lg:ml-64 pt-24 p-4 lg:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Connect with a Counselor</h2>
        <p className="text-gray-500 mb-8">Access professional support when you need it most. Your request is confidential.</p>

        {!isModerateOrSevere && (
            <div className="p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-lg mb-6">
                <p className="font-semibold">Note:</p>
                <p className="text-sm">While our quiz indicated a **{quizResult}** level, you are welcome to fill out this form to connect with resources if you feel you need professional support.</p>
            </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl">
            {isSubmitted ? (
                <div className="text-center py-10">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    <h3 className="text-2xl font-bold mt-4 text-gray-800">Request Sent Successfully!</h3>
                    <p className="mt-2 text-gray-600">A professional will review your request and contact you within 24-48 hours via your provided email.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                            <input type="text" defaultValue={user.name} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                            <input type="email" defaultValue={user.email} className="w-full px-4 py-2 border rounded-lg" required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Primary Reason for Seeking Help</label>
                        <select className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required>
                            <option value="">Select a reason...</option>
                            <option>High stress/Anxiety</option>
                            <option>Depression/Low mood</option>
                            <option>Relationship issues</option>
                            <option>Grief/Loss</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Describe Your Current Situation (Optional)</label>
                        <textarea rows="4" placeholder="Briefly explain what you're experiencing..." className="w-full p-4 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    >
                        Submit Connection Request
                    </button>
                </form>
            )}
            
            <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-sm">
                <p className="font-bold text-red-700">Crisis Warning:</p>
                <p className="text-red-600">This is NOT an emergency service. If you are in immediate danger, please call 988 (US) or your local emergency number.</p>
            </div>
        </div>
      </div>
    );
  };

  const ProfilePage = () => {
    return (
      <div className="lg:ml-64 pt-24 p-4 lg:p-8 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Profile & History</h2>

        <div className="grid md:grid-cols-3 gap-8">
            {/* User Info & Settings */}
            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-xl h-fit">
                <div className="flex items-center space-x-4 mb-6">
                    <User className="w-10 h-10 text-indigo-600 p-2 bg-indigo-100 rounded-full" />
                    <div>
                        <p className="text-xl font-bold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>User ID:</strong> <span className="text-xs break-all">{user.userId}</span></p>
                    <p><strong>Status:</strong> <span className={`font-bold ${resultText === 'Severe' ? 'text-red-500' : 'text-green-500'}`}>{resultText} Risk</span></p>
                </div>
                
                <button className="w-full mt-6 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition font-semibold">
                    Update Personal Info
                </button>
            </div>
            
            {/* History & Trends */}
            <div className="md:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Quiz History</h3>
                    <ul className="space-y-3">
                        {/* Mock History Data */}
                        <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">10/12/2024</span>
                            <span className="text-sm font-semibold text-green-600">Mild</span>
                        </li>
                        <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">09/01/2024</span>
                            <span className="text-sm font-semibold text-yellow-600">Moderate</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Task Performance</h3>
                    {/* Placeholder for a performance chart */}
                    <div className="h-40 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 font-semibold">
                        [Placeholder for D3/Recharts Visualization]
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const ContactPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => { setIsSubmitted(false); console.log("Contact Form Submitted"); }, 3000);
    };

    return (
        <div className="lg:ml-64 pt-24 p-4 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact & Support</h2>
            <p className="text-gray-500 mb-8">Have a question or need technical support? Send us a message.</p>

            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-3xl">
                {isSubmitted ? (
                    <div className="text-center py-10">
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <h3 className="text-2xl font-bold mt-4 text-gray-800">Message Sent!</h3>
                        <p className="mt-2 text-gray-600">Thank you for reaching out. We will get back to you as soon as possible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Your Name</label>
                                <input type="text" placeholder="John Doe" className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Your Email</label>
                                <input type="email" placeholder="john.doe@email.com" className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Subject</label>
                                <input type="text" placeholder="Account Issue / Feedback / General Inquiry" className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                                <textarea rows="6" placeholder="Type your message here..." className="w-full p-4 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
                        >
                            Send Message
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
      case 'home': // treat home as landing if unauthenticated
        return <LandingPage />;
      case 'login':
        return <AuthForm type="login" />;
      case 'signup':
        return <AuthForm type="signup" />;
      case 'quiz':
        return isAuthenticated ? <QuizScreen /> : <AuthForm type="login" />; // Force login if accessing quiz directly
      case 'dashboard':
        return isAuthenticated ? <Dashboard /> : <AuthForm type="login" />;
      case 'community':
        return isAuthenticated ? <CommunityPage /> : <AuthForm type="login" />;
      case 'counselor':
        return isAuthenticated ? <CounselorConnectPage /> : <AuthForm type="login" />;
      case 'profile':
        return isAuthenticated ? <ProfilePage /> : <AuthForm type="login" />;
      case 'contact':
        return <ContactPage />;
      default:
        return <LandingPage />;
    }
  };

  const showSidebar = isAuthenticated && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'quiz';
  const mainContentClass = showSidebar ? 'lg:pl-64' : 'lg:pl-0';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        /* Custom font import for aesthetics */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f9fafb; /* Light background for the whole body */
        }
      `}</style>
      <Header />
      {showSidebar && <Sidebar />}
      <main className={`${mainContentClass} transition-all duration-300`}>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
