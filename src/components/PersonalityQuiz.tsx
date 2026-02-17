import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Trophy, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface PersonalityQuizProps {
  isOpen: boolean;
  onClose: () => void;
  birthdayName: string;
}

const questions = [
  {
    question: "What's my favorite way to spend a weekend?",
    options: ["Netflix marathon 🎬", "Outdoor adventure 🏕️", "Shopping spree 🛍️", "Sleeping in 😴"],
    correct: 1,
  },
  {
    question: "What's my go-to comfort food?",
    options: ["Pizza 🍕", "Ice cream 🍦", "Chocolate 🍫", "Pasta 🍝"],
    correct: 1,
  },
  {
    question: "What's my hidden talent?",
    options: ["Dancing 💃", "Singing 🎤", "Cooking 👨‍🍳", "Chess 🎮"],
    correct: 3,
  },
  {
    question: "What's my biggest fear?",
    options: ["Spiders 🕷️", "Heights 🏔️", "Public speaking 🎤", "Missing a sale 🏷️"],
    correct: 2,
  },
  {
    question: "What would I do with a million dollars?",
    options: ["Travel the world ✈️", "Buy a mansion 🏠", "Start a business 💼", "Throw the biggest party 🎉"],
    correct: 0,
  },
];

const resultMessages = [
  { min: 0, max: 1, emoji: "😅", title: "Oops!", message: "Looks like you need to spend more time with me!" },
  { min: 2, max: 2, emoji: "🤔", title: "Not Bad!", message: "You know me a little, keep trying!" },
  { min: 3, max: 3, emoji: "😊", title: "Pretty Good!", message: "You definitely pay attention!" },
  { min: 4, max: 4, emoji: "🥰", title: "Amazing!", message: "You really get me!" },
  { min: 5, max: 5, emoji: "💖", title: "Perfect Score!", message: "You're my soulmate! You know me better than I know myself!" },
];

export default function PersonalityQuiz({ isOpen, onClose, birthdayName }: PersonalityQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f9a8d4', '#fcd34d', '#a78bfa'],
      });
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 },
        });
      }
    }, 1000);
  };

  const getResult = () => {
    return resultMessages.find(r => score >= r.min && score <= r.max) || resultMessages[0];
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
  };

  const handleClose = () => {
    resetQuiz();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass-card p-6 md:p-8 w-full max-w-lg h-full max-h-[90vh] md:h-auto md:max-h-[80vh] overflow-auto flex flex-col">
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>

              <AnimatePresence mode="wait">
                {!showResult ? (
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>Score: {score} ⭐</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question */}
                    <div className="text-center mb-8">
                      <motion.div
                        className="inline-block text-4xl mb-4"
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        🤔
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-display text-gradient">
                        {questions[currentQuestion].question}
                      </h3>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => selectedAnswer === null && handleAnswer(index)}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            selectedAnswer === null
                              ? 'glass-card hover:border-primary/50'
                              : selectedAnswer === index
                                ? index === questions[currentQuestion].correct
                                  ? 'bg-green-500/30 border-green-500'
                                  : 'bg-red-500/30 border-red-500'
                                : index === questions[currentQuestion].correct
                                  ? 'bg-green-500/30 border-green-500'
                                  : 'opacity-50'
                          } border-2 border-transparent`}
                          whileHover={selectedAnswer === null ? { scale: 1.02, x: 10 } : {}}
                          whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="text-foreground">{option}</span>
                            {selectedAnswer !== null && index === questions[currentQuestion].correct && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto text-green-500"
                              >
                                ✓
                              </motion.span>
                            )}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="text-7xl mb-6"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                    >
                      {getResult().emoji}
                    </motion.div>

                    <h3 className="text-3xl font-display text-gradient mb-2">
                      {getResult().title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      {getResult().message}
                    </p>

                    <div className="flex justify-center gap-2 mb-8">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {i < score ? (
                            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                          ) : (
                            <Star className="w-8 h-8 text-muted" />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-xl font-display text-champagne mb-8">
                      You scored {score} out of {questions.length}!
                    </p>

                    <div className="flex gap-4 justify-center">
                      <motion.button
                        onClick={resetQuiz}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Try Again
                      </motion.button>
                      <motion.button
                        onClick={handleClose}
                        className="px-6 py-3 rounded-full border-2 border-muted text-foreground font-semibold hover:border-primary transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
