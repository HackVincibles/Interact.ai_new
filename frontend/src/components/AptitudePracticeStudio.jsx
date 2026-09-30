import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, Trophy, HelpCircle, Lightbulb, RotateCcw } from 'lucide-react';
import './AptitudePracticeStudio.css';

const APTITUDE_QUESTIONS = [
  {
    id: 1,
    category: 'Quantitative Aptitude',
    question: 'A train running at 72 km/h crosses a 200m platform in 25 seconds. What is the length of the train?',
    options: ['250 meters', '300 meters', '350 meters', '400 meters'],
    correct: 1, // 300m
    explanation: 'Speed = 72 * (5/18) = 20 m/s. Total Distance = Speed * Time = 20 * 25 = 500m. Length of Train = Total Distance - Platform Length = 500 - 200 = 300 meters.'
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    question: 'A can complete a work in 15 days and B in 20 days. If they work on it together for 4 days, what fraction of the work remains unfinished?',
    options: ['7 / 15', '8 / 15', '11 / 15', '1 / 3'],
    correct: 1, // 8/15
    explanation: 'A\'s 1-day work = 1/15. B\'s 1-day work = 1/20. Together 1-day work = (1/15 + 1/20) = 7/60. 4 days work = 4 * (7/60) = 7/15. Remaining work = 1 - (7/15) = 8/15.'
  },
  {
    id: 3,
    category: 'Quantitative Aptitude',
    question: 'If 20% of a number X is equal to 30% of a number Y, what is the ratio of X to Y?',
    options: ['2 : 3', '3 : 2', '5 : 6', '6 : 5'],
    correct: 1, // 3:2
    explanation: '0.20 * X = 0.30 * Y => X / Y = 0.30 / 0.20 = 3 / 2 = 3 : 2.'
  },
  {
    id: 4,
    category: 'Quantitative Aptitude',
    question: 'A trader sells an article for $480 incurring a loss of 20%. At what price should he sell it to gain 20%?',
    options: ['$600', '$720', '$800', '$640'],
    correct: 1, // $720
    explanation: 'Selling Price at 20% loss = 80% of Cost Price = $480 => Cost Price = $600. Target Selling Price (120% of CP) = 1.20 * $600 = $720.'
  },
  {
    id: 5,
    category: 'Logical Reasoning',
    question: 'Find the missing term in the number series: 4, 9, 25, 49, 121, ?, 289.',
    options: ['144', '169', '196', '225'],
    correct: 1, // 169
    explanation: 'The numbers are squares of consecutive prime numbers: 2², 3², 5², 7², 11², 13², 17². Thus 13² = 169.'
  },
  {
    id: 6,
    category: 'Logical Reasoning',
    question: 'In a certain code language, "COMPUTER" is coded as "RFUVQNPC". How is "MEDICINE" coded in that language?',
    options: ['EOJDJEFM', 'EOJDEJFM', 'MFEJDJOE', 'MFEJDJEO'],
    correct: 0, // EOJDJEFM
    explanation: 'Reverse the word ("RETUPMOC") and shift each letter by +1 forward in the alphabet to get "EOJDJEFM".'
  },
  {
    id: 7,
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph, a man said: "I have no brother or sister, but that man\'s father is my father\'s son." Whose photograph was it?',
    options: ['His own', 'His son\'s', 'His father\'s', 'His nephew\'s'],
    correct: 1, // His son's
    explanation: 'Since he has no siblings, "my father\'s son" is himself. So, "that man\'s father is myself". Therefore, the photograph is of his son.'
  },
  {
    id: 8,
    category: 'Quantitative Aptitude',
    question: 'The average score of a batsman in 10 innings was 32 runs. How many runs must he score in his next inning to increase his average by 4 runs?',
    options: ['76', '72', '68', '80'],
    correct: 0, // 76
    explanation: 'Total runs in 10 innings = 320. Target average for 11 innings = 36. Total runs needed = 11 * 36 = 396. Runs needed in 11th inning = 396 - 320 = 76.'
  },
  {
    id: 9,
    category: 'Logical Reasoning',
    question: 'A person walks 5 km North, turns right and walks 3 km, then turns right again and walks 5 km. How far is he from his starting point?',
    options: ['3 km', '5 km', '8 km', '0 km'],
    correct: 0, // 3 km
    explanation: 'Walking 5 km North and 5 km South cancels out vertical movement. He is 3 km East of the starting point.'
  },
  {
    id: 10,
    category: 'Quantitative Aptitude',
    question: 'In how many different ways can the letters of the word "LEADING" be arranged such that vowels always stay together?',
    options: ['360', '480', '720', '5040'],
    correct: 2, // 720
    explanation: 'Vowels = E, A, I (3 vowels). Group them as 1 unit. Total units = {EAI}, L, D, N, G (5 units). 5 units can be arranged in 5! = 120 ways. Vowels within their group can be arranged in 3! = 6 ways. Total = 120 * 6 = 720.'
  },
  {
    id: 11,
    category: 'Quantitative Aptitude',
    question: 'Two dice are rolled simultaneously. What is the probability that the product of the two numbers shown is even?',
    options: ['1 / 2', '3 / 4', '3 / 8', '5 / 12'],
    correct: 1, // 3/4
    explanation: 'Product is odd ONLY if both dice show odd numbers (Probability = 3/6 * 3/6 = 1/4). Thus, probability of product being even = 1 - 1/4 = 3/4.'
  },
  {
    id: 12,
    category: 'Quantitative Aptitude',
    question: 'The ratio of present ages of Sameer and Anand is 5 : 4. In 3 years, the ratio becomes 11 : 9. What is Anand\'s present age?',
    options: ['24 years', '27 years', '30 years', '36 years'],
    correct: 0, // 24
    explanation: 'Let ages be 5x and 4x. (5x + 3)/(4x + 3) = 11/9 => 45x + 27 = 44x + 33 => x = 6. Anand\'s age = 4 * 6 = 24 years.'
  },
  {
    id: 13,
    category: 'Quantitative Aptitude',
    question: 'Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both are opened together, how long will it take to fill the tank?',
    options: ['10 minutes', '12 minutes', '15 minutes', '25 minutes'],
    correct: 1, // 12
    explanation: 'Time = 1 / (1/20 + 1/30) = 1 / (5/60) = 60 / 5 = 12 minutes.'
  },
  {
    id: 14,
    category: 'Logical Reasoning',
    question: 'Statements: All cats are dogs. All dogs are birds. Conclusions: I. All cats are birds. II. All birds are cats.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
    correct: 0, // Only I follows
    explanation: 'Cat ⊂ Dog ⊂ Bird. Therefore, all cats are birds (Conclusion I holds true), but not all birds are necessarily cats.'
  },
  {
    id: 15,
    category: 'Quantitative Aptitude',
    question: 'A principal sum at simple interest doubles itself in 8 years. In how many years will it triple itself at the same rate of interest?',
    options: ['12 years', '16 years', '20 years', '24 years'],
    correct: 1, // 16 years
    explanation: 'Simple interest earned in 8 years = P. To triple, interest needed = 2P. Time needed = 8 * 2 = 16 years.'
  },
  {
    id: 16,
    category: 'Quantitative Aptitude',
    question: 'Calculate the compound interest on $10,000 at 10% per annum for 2 years, compounded annually.',
    options: ['$2,000', '$2,100', '$2,200', '$1,210'],
    correct: 1, // $2,100
    explanation: 'Amount = 10000 * (1.10)² = 10000 * 1.21 = $12,100. Compound Interest = $12,100 - $10,000 = $2,100.'
  },
  {
    id: 17,
    category: 'Logical Reasoning',
    question: 'Select the odd one out from the given choices:',
    options: ['Apple', 'Mango', 'Orange', 'Potato'],
    correct: 3, // Potato
    explanation: 'Potato is a vegetable/root tuber, whereas Apple, Mango, and Orange are fruits.'
  },
  {
    id: 18,
    category: 'Quantitative Aptitude',
    question: 'A boat travels with a speed of 13 km/h in still water. If stream speed is 4 km/h, find time taken to travel 68 km downstream.',
    options: ['3 hours', '4 hours', '5 hours', '6 hours'],
    correct: 1, // 4 hours
    explanation: 'Downstream speed = 13 + 4 = 17 km/h. Time = Distance / Speed = 68 / 17 = 4 hours.'
  },
  {
    id: 19,
    category: 'Logical Reasoning',
    question: 'Complete the verbal analogy: Foot : Shoe :: Hand : ?',
    options: ['Ring', 'Glove', 'Wrist', 'Finger'],
    correct: 1, // Glove
    explanation: 'A shoe covers a foot just as a glove covers a hand.'
  },
  {
    id: 20,
    category: 'Quantitative Aptitude',
    question: 'The HCF of two numbers is 11 and their LCM is 7700. If one of the numbers is 275, find the other number.',
    options: ['279', '308', '318', '328'],
    correct: 1, // 308
    explanation: 'Product of two numbers = HCF * LCM => 275 * N = 11 * 7700 => N = 84700 / 275 = 308.'
  },
  {
    id: 21,
    category: 'Quantitative Aptitude',
    question: 'At 3:15, what is the angle between the hour hand and the minute hand of a clock?',
    options: ['0°', '7.5°', '12.5°', '15°'],
    correct: 1, // 7.5°
    explanation: 'At 3:15, minute hand is at 15 min (90°). Hour hand moves 0.5° per minute, so at 15 mins it moves 15 * 0.5° = 7.5° past 3 o\'clock position (90°). Angle = 97.5° - 90° = 7.5°.'
  },
  {
    id: 22,
    category: 'Logical Reasoning',
    question: 'Five colleagues A, B, C, D, and E are seated in a row. A is next to B, C is next to D. D is not beside E. If A is right of B and E is left of C, who sits in the middle?',
    options: ['A', 'B', 'C', 'D'],
    correct: 0, // A
    explanation: 'Arrangement from left to right: B, A, E, C, D. A is seated in the center (middle).'
  },
  {
    id: 23,
    category: 'Quantitative Aptitude',
    question: 'In what ratio must tea costing $60/kg be mixed with tea costing $65/kg so that selling the mixture at $68.20/kg gives a 10% profit?',
    options: ['3 : 2', '3 : 4', '3 : 5', '4 : 3'],
    correct: 0, // 3:2
    explanation: 'Cost Price of mixture = $68.20 / 1.10 = $62. By Alligation rule: Ratio = (65 - 62) : (62 - 60) = 3 : 2.'
  },
  {
    id: 24,
    category: 'Logical Reasoning',
    question: 'Statement: "Notice: Keep off the grass." Assumptions: I. People read public notices. II. Grass is hazardous to health.',
    options: ['Only assumption I is implicit', 'Only assumption II is implicit', 'Both assumptions are implicit', 'Neither assumption is implicit'],
    correct: 0, // Only I is implicit
    explanation: 'Notices are posted on the implicit assumption that people read them. Grass being hazardous is irrelevant.'
  },
  {
    id: 25,
    category: 'Quantitative Aptitude',
    question: 'In a class of 50 students, 30 play Cricket, 25 play Football, and 10 play both games. How many students play neither game?',
    options: ['5', '10', '15', '20'],
    correct: 0, // 5
    explanation: 'Total playing at least 1 game = (30 + 25 - 10) = 45. Neither game = Total - 45 = 50 - 45 = 5.'
  },
  {
    id: 26,
    category: 'Quantitative Aptitude',
    question: 'Calculate: 25% of 480 + 30% of 300 = ?',
    options: ['210', '220', '230', '240'],
    correct: 0, // 210
    explanation: '(0.25 * 480) + (0.30 * 300) = 120 + 90 = 210.'
  },
  {
    id: 27,
    category: 'Logical Reasoning',
    question: 'Is integer X even? Statement 1: X is divisible by 4. Statement 2: X is divisible by 2.',
    options: ['Statement 1 alone is sufficient', 'Statement 2 alone is sufficient', 'Either statement alone is sufficient', 'Both statements together are sufficient'],
    correct: 2, // Either statement alone is sufficient
    explanation: 'Divisibility by 4 or by 2 independently proves X is an even integer.'
  },
  {
    id: 28,
    category: 'Quantitative Aptitude',
    question: 'Find the value of x where x = √(6 + √(6 + √(6 + ... ∞))).',
    options: ['2', '3', '6', '9'],
    correct: 1, // 3
    explanation: 'x = √(6 + x) => x² - x - 6 = 0 => (x - 3)(x + 2) = 0 => x = 3.'
  },
  {
    id: 29,
    category: 'Logical Reasoning',
    question: 'Which day of the week was India\'s Independence Day on 15th August 1947?',
    options: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    correct: 2, // Friday
    explanation: 'Calculating total odd days from 1600 AD to 15th Aug 1947 yields 5 odd days, corresponding to Friday.'
  },
  {
    id: 30,
    category: 'Quantitative Aptitude',
    question: 'If the radius of a circle is increased by 50%, what is the percentage increase in its surface area?',
    options: ['50%', '100%', '125%', '150%'],
    correct: 2, // 125%
    explanation: 'Area is proportional to r². New area = π * (1.5r)² = 2.25 * πr². Increase = 2.25 - 1 = 1.25 = 125%.'
  }
];

export default function AptitudePracticeStudio({ onFinishAssessment, onBackToSetup }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: optionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = APTITUDE_QUESTIONS[currentIndex];

  const handleSelectOption = (optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let score = 0;
    APTITUDE_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    const score = calculateScore();
    const percent = Math.round((score / APTITUDE_QUESTIONS.length) * 100);
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="aptitude-studio-root animate-fade-in">
        <div className="aptitude-results-container">
          <div className="scorecard-card card-base">
            <span className="aptitude-badge">TEST COMPLETE</span>
            <h1 style={{ margin: '16px 0 8px 0', fontSize: '2rem', fontWeight: '800' }}>
              Aptitude Assessment Results
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Detailed performance breakdown for your Aptitude & Reasoning test.
            </p>

            <div className="score-circle">
              <span className="score-num">{score}</span>
              <span className="score-sub">out of {APTITUDE_QUESTIONS.length}</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '16px 0 8px' }}>
              Score: <span style={{ color: percent >= 70 ? '#10b981' : '#f59e0b' }}>{percent}%</span>
            </h3>

            <div className="score-stats-grid">
              <div className="stat-item">
                <div className="stat-val" style={{ color: '#10b981' }}>{score}</div>
                <div className="stat-lbl">Correct Answers</div>
              </div>
              <div className="stat-item">
                <div className="stat-val" style={{ color: '#ef4444' }}>{answeredCount - score}</div>
                <div className="stat-lbl">Incorrect Answers</div>
              </div>
              <div className="stat-item">
                <div className="stat-val" style={{ color: 'var(--primary-purple)' }}>{formatTime(elapsedSeconds)}</div>
                <div className="stat-lbl">Time Taken</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '30px' }}>
              <button 
                className="btn-primary-purple" 
                style={{ padding: '14px 28px', borderRadius: '30px', fontWeight: '700' }}
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedAnswers({});
                  setCurrentIndex(0);
                  setElapsedSeconds(0);
                }}
              >
                <RotateCcw size={16} style={{ marginRight: '8px' }} /> Retake Aptitude Test
              </button>
              
              <button 
                className="btn-secondary" 
                style={{ padding: '14px 28px', borderRadius: '30px', fontWeight: '700' }}
                onClick={onBackToSetup}
              >
                Back to Practice Arena
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aptitude-studio-root animate-fade-in">
      {/* Top Header */}
      <header className="aptitude-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="aptitude-badge">
            <Trophy size={14} /> APTITUDE MCQ PRACTICE
          </span>
          <h2 className="aptitude-title">Quantitative & Logical Reasoning (30 Questions)</h2>
        </div>

        <div className="aptitude-timer">
          <Clock size={16} color="var(--primary-purple)" />
          <span>Timer: {formatTime(elapsedSeconds)}</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-secondary"
            style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem' }}
            onClick={onBackToSetup}
          >
            Exit Test
          </button>

          <button 
            className="btn-primary-purple"
            style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}
            onClick={handleSubmit}
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="aptitude-layout">
        
        {/* Left Sidebar: Question Grid Navigator */}
        <div className="aptitude-sidebar">
          <div className="sidebar-title">Question Navigator</div>
          <div className="question-grid">
            {APTITUDE_QUESTIONS.map((q, idx) => {
              const isSelected = selectedAnswers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              const isFlagged = flaggedQuestions[q.id];

              let classNames = 'q-grid-btn';
              if (isCurrent) classNames += ' current';
              if (isSelected) classNames += ' answered';
              if (isFlagged) classNames += ' flagged';

              return (
                <button 
                  key={q.id}
                  className={classNames}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowExplanation(false);
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="sidebar-legend">
            <div className="legend-item">
              <span className="legend-dot answered" />
              <span>Answered ({Object.keys(selectedAnswers).length}/30)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot current" />
              <span>Current Question (#{currentIndex + 1})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot unanswered" />
              <span>Unanswered ({30 - Object.keys(selectedAnswers).length})</span>
            </div>
          </div>
        </div>

        {/* Right Main Area: MCQ Question */}
        <div className="aptitude-main-panel">
          <div className="question-card">
            
            <div className="q-header">
              <span className="q-number-tag">Question {currentIndex + 1} of {APTITUDE_QUESTIONS.length}</span>
              <span className="q-category-tag">{currentQ.category}</span>
            </div>

            <h3 className="q-text">{currentQ.question}</h3>

            <div className="options-list">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === oIdx;
                const labels = ['A', 'B', 'C', 'D'];
                return (
                  <button 
                    key={oIdx}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(oIdx)}
                  >
                    <div className="option-label">{labels[oIdx]}</div>
                    <div className="option-text">{opt}</div>
                  </button>
                );
              })}
            </div>

            {/* View Explanation Button / Toggle */}
            <div style={{ marginBottom: '20px' }}>
              <button 
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '6px 14px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setShowExplanation(!showExplanation)}
              >
                <Lightbulb size={14} color="#f59e0b" />
                {showExplanation ? 'Hide Explanation' : 'Show Explanation & Formula'}
              </button>
            </div>

            {showExplanation && (
              <div className="explanation-box animate-fade-in">
                <div className="explanation-title">
                  <CheckCircle2 size={16} /> Answer Explanation:
                </div>
                <p className="explanation-text">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="actions-bar">
              <button 
                className="btn-secondary"
                style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '0.9rem' }}
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    setShowExplanation(false);
                  }
                }}
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Previous
              </button>

              <button 
                className="btn-secondary"
                style={{ padding: '10px 18px', borderRadius: '10px', fontSize: '0.9rem', color: flaggedQuestions[currentQ.id] ? '#f59e0b' : 'inherit' }}
                onClick={toggleFlag}
              >
                {flaggedQuestions[currentQ.id] ? '🚩 Flagged' : 'Flag for Review'}
              </button>

              {currentIndex < APTITUDE_QUESTIONS.length - 1 ? (
                <button 
                  className="btn-primary-purple"
                  style={{ padding: '10px 22px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700' }}
                  onClick={() => {
                    setCurrentIndex(currentIndex + 1);
                    setShowExplanation(false);
                  }}
                >
                  Next Question <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                </button>
              ) : (
                <button 
                  className="btn-primary-purple"
                  style={{ padding: '10px 22px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', background: '#10b981' }}
                  onClick={handleSubmit}
                >
                  Submit Assessment <CheckCircle2 size={16} style={{ marginLeft: '6px' }} />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
