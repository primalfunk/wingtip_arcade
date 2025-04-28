import React, { useState, useEffect } from 'react';
import { ScoreProvider, useScore } from './ScoreProvider';
import ScoreCounter from './ScoreCounter';
import StreakCounter from './StreakCounter';
import { shuffle, getOptions } from './utils';
import confetti from 'canvas-confetti';

export default function DecimalGameWrapper({ onExit }) {
  const [mode, setMode] = useState('1x1');

  return (
    <ScoreProvider>
      <div className="app-container">
        <div className="game-box fade-in">
          <FlashcardGame mode={mode} setMode={setMode} onQuit={onExit} />
        </div>
      </div>
    </ScoreProvider>
  );
}

function FlashcardGame({ mode, setMode, onQuit }) {
  const [question, setQuestion] = useState(generateQuestion(mode));
  const [disabled, setDisabled] = useState(false);
  const [foxMood, setFoxMood] = useState('neutral');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { setScore } = useScore();

  useEffect(() => {
    setQuestion(generateQuestion(mode));
  }, [mode]);

  function handleChoice(choice) {
    setDisabled(true);
    if (choice === question.correctAnswer) {
      setFoxMood('joyful');
      setStreak(s => s + 1);
      confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { x: 0.5, y: 0.3 } });
      new Audio('/assets/hit.mp3').play();
      setCorrectCount(c => c + 1);
      setScore(s => s + 1);
    } else {
      setFoxMood('sad');
      setStreak(0);
      new Audio('/assets/miss.mp3').play();
      setIncorrectCount(c => c + 1);
    }

    setTimeout(() => {
      setQuestion(generateQuestion(mode));
      setFoxMood('neutral');
      setAnimKey(k => k + 1);
      setDisabled(false);
    }, 800);
  }

  if (showSummary) {
    return (
      <div className="game-box fade-in main-column" style={{ flexDirection: 'column' }}>
        <img src="/assets/fox-neutral.png" alt="Fox mascot" className="mascot" />
        <h2>Great job!</h2>
        <p>Questions answered: {correctCount + incorrectCount}</p>
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {incorrectCount}</p>
        <p>Accuracy: {((correctCount / (correctCount + incorrectCount || 1)) * 100).toFixed(1)}%</p>
        <button onClick={onQuit}>Back to Main Menu</button>
      </div>
    );
  }

  return (
    <div key={animKey} className="game-box fade-in main-column" style={{ flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="1x1">1-digit × 1-digit</option>
          <option value="1xDecimal">1-digit × 0.X</option>
          <option value="2digitDecimalxDecimal">X.X or XX × 0.X</option>
          <option value="2digitx2digit">2-digit × 2-digit</option>
        </select>
      </div>
      <img src={`/assets/fox-${foxMood}.png`} alt="Fox mascot" className="mascot" />
      <h1>What is {question.prompt}?</h1>
      <div className="button-group">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            disabled={disabled}
            className={disabled ? (opt === question.correctAnswer ? 'correct' : 'incorrect') : ''}
          >
            {opt}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={() => setShowSummary(true)}
          disabled={disabled}
          style={{ background: '#eee', padding: '0.5rem 1.5rem', fontSize: '1.5rem' }}
        >
          Quit
        </button>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
        ✅ {correctCount}  ❌ {incorrectCount}
      </div>
      <StreakCounter streak={streak} />
    </div>
  );
}

// ============ Question Generator =============

function getWholeNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSingleDecimal(min, max) {
  const raw = (Math.random() * (max - min) + min);
  return Math.round(raw * 10) / 10;
}

function generateQuestion(mode) {
  let a, b;

  switch (mode) {
    case '1x1':
      a = getWholeNumber(1, 9);
      b = getWholeNumber(1, 9);
      break;
    case '1xDecimal':
      a = getWholeNumber(1, 9);
      b = getSingleDecimal(0.1, 0.9);
      break;
    case '2digitDecimalxDecimal':
      a = getSingleDecimal(1.1, 9.9); // includes decimals
      b = getSingleDecimal(0.1, 0.9);
      break;
    case '2digitx2digit':
      a = Math.random() > 0.5 ? getWholeNumber(10, 99) : getSingleDecimal(1.1, 9.9);
      b = Math.random() > 0.5 ? getWholeNumber(10, 99) : getSingleDecimal(1.1, 9.9);
      break;
    default:
      a = 1; b = 1;
  }

  const product = roundAnswer(a * b);
  const prompt = `${a} × ${b}`;
  const options = generateAnswerOptions(product, mode);

  return {
    prompt,
    correctAnswer: product,
    options
  };
}

function roundAnswer(value) {
  const rounded = Math.round(value * 100) / 100;
  return (Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2));
}

function generateAnswerOptions(correct, mode) {
  let correctValue = parseFloat(correct);
  let distractors = new Set();

  while (distractors.size < 2) {
    let variation = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 0.1);
    let wrong = Math.round((correctValue + variation) * 100) / 100;

    if (Number.isInteger(correctValue) && mode === '1x1') {
      wrong = Math.round(correctValue + variation);
    }

    wrong = roundAnswer(wrong);

    if (wrong !== correct) {
      distractors.add(wrong);
    }
  }

  return shuffle([correct, ...distractors]);
}
