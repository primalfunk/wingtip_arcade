import React, { useState, useEffect } from 'react';
import { ScoreProvider, useScore } from './ScoreProvider';
import ScoreCounter from './ScoreCounter';
import StreakCounter from './StreakCounter';
import { shuffle, getOptions } from './utils';
import confetti from 'canvas-confetti';
import elements from '../data/elements';

export default function PeriodicGameWrapper({ onExit }) {
  const [mode, setMode] = useState('symbol-to-name');

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
  const [queue, setQueue] = useState(() => shuffle(elements));
  const [current, setCurrent] = useState(queue[0]);
  const [options, setOptions] = useState(() => buildOptions(queue[0], mode));
  const [disabled, setDisabled] = useState(false);
  const [foxMood, setFoxMood] = useState('neutral');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { setScore } = useScore();

  function buildOptions(correct, mode) {
    let pool;
    switch (mode) {
      case 'symbol-to-name':
        pool = elements.map(e => e.name);
        return getOptions(pool, correct.name);
      case 'proton-to-symbol':
        pool = elements.map(e => e.symbol);
        return getOptions(pool, correct.symbol);
      default:
        return [];
    }
  }

  function getPrompt(current, mode) {
    switch (mode) {
      case 'symbol-to-name':
        return current.symbol;
      case 'proton-to-symbol':
        return current.proton;
      default:
        return '';
    }
  }

  function handleChoice(choice) {
    setDisabled(true);
    const correctAnswer = mode === 'symbol-to-name' ? current.name : current.symbol;
    const isCorrect = choice === correctAnswer;

    if (isCorrect) {
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
      setQueue(prev => {
        const rest = prev.slice(1);
        const newQueue = rest.length > 0 ? rest : shuffle(elements);
        const next = newQueue[0];
        setCurrent(next);
        setOptions(buildOptions(next, mode));
        return newQueue;
      });
      setFoxMood('neutral');
      setAnimKey(k => k + 1);
      setDisabled(false);
    }, isCorrect ? 1000 : 2000);
  }

  if (showSummary) {
    return (
      <div className="game-box fade-in">
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
    <div key={animKey} className="game-box fade-in">
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="symbol-to-name">Symbol → Name</option>
          <option value="proton-to-symbol">Proton # → Symbol</option>
        </select>
      </div>
      <img src={`/assets/fox-${foxMood}.png`} alt="Fox mascot" className="mascot" />
      <h1>What is {getPrompt(current, mode)}?</h1>
      <div className="button-group">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            disabled={disabled}
            className={disabled ? (opt === (mode === 'symbol-to-name' ? current.name : current.symbol) ? 'correct' : 'incorrect') : ''}
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
