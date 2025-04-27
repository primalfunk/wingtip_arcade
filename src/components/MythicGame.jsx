import React, { useState } from 'react';
import { ScoreProvider, useScore } from './ScoreProvider';
import StreakCounter from './StreakCounter';
import { shuffle, getOptions } from './utils';
import confetti from 'canvas-confetti';
import creatures from '../data/creatures';
import '../styles/mythicGame.css';

export default function MythicGameWrapper({ onExit }) {
  return (
    <ScoreProvider>
      <div className="app-container">
        <div className="game-box fade-in">
          <FlashcardGame onQuit={onExit} />
        </div>
      </div>
    </ScoreProvider>
  );
}

function FlashcardGame({ onQuit }) {
  const [queue, setQueue] = useState(() => shuffle(creatures));
  const [current, setCurrent] = useState(queue[0]);
  const [options, setOptions] = useState(() => buildNameOptions(queue[0]));
  const [disabled, setDisabled] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const { setScore } = useScore();

  function buildNameOptions(correct) {
    const pool = creatures.map(c => c.name);
    return getOptions(pool, correct.name);
  }

  function handleChoice(choice) {
    setDisabled(true);
    const isCorrect = choice === current.name;

    if (isCorrect) {
      confetti({ particleCount: 120, spread: 100, startVelocity: 45, origin: { x: 0.5, y: 0.3 } });
      setCorrectCount(c => c + 1);
      setScore(s => s + 1);
      setStreak(s => s + 1);

      setTimeout(nextCard, 1500);
    } else {
      setIncorrectCount(c => c + 1);
      setStreak(0);
      setIsFlipped(true);

      setTimeout(() => {
        setIsFlipped(false);
        nextCard();
      }, 3000);
    }
  }

  function nextCard() {
    setQueue(prev => {
      const rest = prev.slice(1);
      const newQueue = rest.length > 0 ? rest : shuffle(creatures);
      const next = newQueue[0];
      setCurrent(next);
      setOptions(buildNameOptions(next));
      return newQueue;
    });
    setAnimKey(k => k + 1);
    setDisabled(false);
  }

  if (showSummary) {
    return (
      <div className="game-box fade-in">
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
      {/* Question prompt */}
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>What is this?</h1>

      {/* Card container */}
      <div className="card-container">
        <div className={`card ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front">
            <div className="card-panel">
              <img
                src={current.image}
                alt={current.name}
                className="creature-image"
              />
              <div className="culture-overlay">{current.culture}</div>
            </div>
          </div>
          <div className="card-back">
            <div className="bio-panel">
              <h2>{current.name}</h2>
              <p>{current.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Option buttons */}
      <div className="button-group">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            disabled={disabled}
            className={
              disabled
                ? (opt === current.name
                    ? 'correct'
                    : 'incorrect')
                : ''
            }
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Quit Button */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={() => setShowSummary(true)}
          disabled={disabled}
          style={{ background: '#eee', padding: '0.5rem 1.5rem', fontSize: '1.5rem' }}
        >
          Quit
        </button>
      </div>

      {/* Streak counter */}
      <StreakCounter streak={streak} />
    </div>
  );
}
