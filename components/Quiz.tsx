
import React, { useState, useEffect, useRef } from 'react';
import { quizQuestions } from '../data/quizData';
import type { QuizResult, QuestionCategory } from '../types';

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const Quiz: React.FC<QuizProps> = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [categoryStats, setCategoryStats] = useState<Record<string, { correct: number; total: number }>>({});
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Initialize timer when question changes
  useEffect(() => {
    if (isOpen && !showResult) {
      setTimeLeft(currentQuestion.timeLimit);
      setSelectedAnswer('');
      setIsAnswerChecked(false);
      
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, isOpen, showResult]);

  const handleTimeOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswerChecked(true);
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked) return; // Prevent double check
    
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswerChecked(true);

    const isCorrect = selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
    }

    // Update Category Stats
    setCategoryStats(prev => {
      const cat = currentQuestion.category;
      const currentCat = prev[cat] || { correct: 0, total: 0 };
      return {
        ...prev,
        [cat]: {
          correct: currentCat.correct + (isCorrect ? 1 : 0),
          total: currentCat.total + 1
        }
      };
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setCategoryStats({});
  };

  const handleExport = () => {
    const maxScore = quizQuestions.reduce((acc, q) => acc + q.points, 0);
    const rows = [
      ["Kategória", "Helyes válaszok", "Összes kérdés"],
      ...Object.entries(categoryStats).map(([cat, stats]) => [cat, stats.correct, stats.total]),
      [],
      ["Összpontszám", score],
      ["Maximum pontszám", maxScore],
      ["Dátum", new Date().toLocaleDateString()]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodeUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodeUri);
    link.setAttribute("download", `quiz_eredmeny_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!isOpen) return null;

  // --- RESULT SCREEN ---
  if (showResult) {
    const maxScore = quizQuestions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bg-blue-600 p-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">Kvíz Eredmény</h2>
            <div className="text-6xl font-extrabold mb-2">{percentage}%</div>
            <p className="text-blue-100 text-lg">{score} / {maxScore} pont</p>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            <h3 className="font-bold text-gray-700 mb-4 text-xl">Teljesítmény kategóriánként</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryStats).map(([cat, stats]) => (
                <div key={cat} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">{cat}</span>
                    <span className="text-gray-600">{Math.round((stats.correct / stats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right mt-1 text-gray-500">{stats.correct}/{stats.total} helyes</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t flex gap-4 flex-col sm:flex-row">
            <button onClick={handleRestart} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Újraindítás
            </button>
            <button onClick={handleExport} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Eredmény Exportálása
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors">
              Bezárás
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION SCREEN ---
  const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
  const isCorrect = selectedAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">{currentQuestion.category}</span>
            <h2 className="text-gray-500 text-sm">Kérdés {currentQuestionIndex + 1} / {quizQuestions.length}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className={`font-mono font-bold text-lg px-3 py-1 rounded ${timeLeft < 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              {timeLeft}s
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1.5">
          <div className="bg-blue-500 h-1.5 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Content */}
        <div className="p-6 md:p-10 flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">{currentQuestion.text}</h3>

          <div className="max-w-xl mx-auto space-y-4">
            {currentQuestion.type === 'fill-in' ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={selectedAnswer}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  disabled={isAnswerChecked}
                  placeholder="Írd ide a választ..."
                  className={`w-full p-4 text-lg border-2 rounded-lg focus:outline-none text-center ${
                    isAnswerChecked 
                      ? isCorrect 
                        ? 'border-green-500 bg-green-50 text-green-800' 
                        : 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {currentQuestion.hint && !isAnswerChecked && (
                    <p className="text-sm text-gray-500 text-center italic">💡 Tipp: {currentQuestion.hint}</p>
                )}
              </div>
            ) : (
               // Multiple Choice & True/False
               <div className={`grid gap-4 ${currentQuestion.options && currentQuestion.options.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>
                 {currentQuestion.options?.map((option) => {
                   let btnClass = "p-4 rounded-xl text-lg font-semibold border-2 transition-all duration-200 ";
                   
                   if (isAnswerChecked) {
                     if (option === currentQuestion.correctAnswer) {
                       btnClass += "bg-green-100 border-green-500 text-green-700";
                     } else if (option === selectedAnswer) {
                       btnClass += "bg-red-100 border-red-500 text-red-700";
                     } else {
                       btnClass += "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
                     }
                   } else {
                     if (option === selectedAnswer) {
                       btnClass += "bg-blue-50 border-blue-500 text-blue-700 shadow-md transform scale-[1.02]";
                     } else {
                       btnClass += "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50";
                     }
                   }

                   return (
                     <button
                       key={option}
                       onClick={() => handleAnswerSelect(option)}
                       disabled={isAnswerChecked}
                       className={btnClass}
                     >
                       {option}
                     </button>
                   );
                 })}
               </div>
            )}
          </div>
          
          {/* Feedback Section */}
          {isAnswerChecked && (
             <div className={`mt-8 p-4 rounded-lg text-center animate-fade-in ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
               <p className="font-bold text-lg mb-1">{isCorrect ? "Helyes válasz! 🎉" : "Sajnos nem talált. 😔"}</p>
               {!isCorrect && <p>A helyes válasz: <strong>{currentQuestion.correctAnswer}</strong></p>}
               <p className="text-sm mt-2 opacity-80">+{isCorrect ? currentQuestion.points : 0} pont</p>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t flex justify-between items-center">
          <div className="text-gray-600 font-semibold">
            Pontszám: <span className="text-blue-600 text-xl ml-2">{score}</span>
          </div>
          
          {!isAnswerChecked ? (
            <button 
              onClick={handleCheckAnswer}
              disabled={!selectedAnswer}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              Ellenőrzés
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? 'Következő' : 'Eredmények'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Quiz;
