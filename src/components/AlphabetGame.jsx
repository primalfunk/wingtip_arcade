// src/components/AlphabetGame.jsx
import React, { useState } from 'react';
import { ScoreProvider, useScore } from './ScoreProvider';
import ScoreCounter from './ScoreCounter';
import { shuffle, getOptions } from './utils';
import confetti from 'canvas-confetti';
import StreakCounter from './StreakCounter';

export default function AlphabetGameWrapper({ onExit }) {
  const [poolKey, setPoolKey] = useState('all');
  const [caseMode, setCaseMode] = useState('upper');
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const letterPools = {
    first9: letters.slice(0, 9),
    second9: letters.slice(9, 18),
    third: letters.slice(18),
    all: letters,
  };

  return (
    <ScoreProvider>
      <div className="app-container">
        <div className="game-box fade-in">
          <FlashcardGame
            poolKey={poolKey}
            setPoolKey={setPoolKey}
            letterPools={letterPools}
            caseMode={caseMode}
            setCaseMode={setCaseMode}
            onQuit={onExit}
          />
        </div>
      </div>
    </ScoreProvider>
  );
}

function FlashcardGame({
  poolKey,
  setPoolKey,
  letterPools,
  caseMode,
  setCaseMode,
  onQuit,
}) {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const sounds = letters.reduce((o, l) => {
    o[l] = `/assets/${l}.wav`;
    return o;
  }, {});
  sounds.hit = '/assets/hit.mp3';
  sounds.miss = '/assets/miss.mp3';

  const [queue, setQueue] = useState(() => shuffle(letterPools[poolKey]));
  const [current, setCurrent] = useState(queue[0]);
  const [options, setOptions] = useState(() =>
    getOptions(letterPools[poolKey], current)
  );
  const [disabled, setDisabled] = useState(false);
  const [foxMood, setFoxMood] = useState('neutral');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { setScore } = useScore();

  function renderLetter(l) {
    if (caseMode === 'upper') return l.toUpperCase();
    if (caseMode === 'lower') return l.toLowerCase();
    if (caseMode === 'mixed')
      return Math.random() > 0.5 ? l.toUpperCase() : l.toLowerCase();
    return l;
  }

  function handleChoice(choice) {
    setDisabled(true);

    if (choice === current) {
      setFoxMood('joyful');
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.3 },
      });
      new Audio(sounds.hit).play();
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setFoxMood('sad');
      new Audio(sounds.miss).play();
      setIncorrectCount((c) => c + 1);
      setStreak(0);
    }

    setTimeout(() => {
      setQueue((prev) => {
        const rest = prev.slice(1);
        const newQueue =
          rest.length > 0 ? rest : shuffle(letterPools[poolKey]);
        const next = newQueue[0];
        setCurrent(next);
        setOptions(getOptions(letterPools[poolKey], next));

        setTimeout(() => {
          new Audio(sounds[next]).play();
        }, 150);

        return newQueue;
      });
      setFoxMood('neutral');
      setAnimKey((k) => k + 1);
      setDisabled(false);
    }, 800);
  }

  if (!hasStarted) {
    return (
      <div className="game-box fade-in main-column" style={{ flexDirection: 'column' }}>
        <img src="/assets/fox-neutral.png" alt="Fox mascot" className="mascot" />
        <h2>Ready to play?</h2>
        <button
          onClick={() => {
            setHasStarted(true);
            setTimeout(() => {
              new Audio(sounds[current]).play();
            }, 100);
          }}
        >
          ▶ Start Game
        </button>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="game-box fade-in main-column" style={{ flexDirection: 'column' }}>
        <img src="/assets/fox-neutral.png" alt="Fox mascot" className="mascot" />
        <h2>Great job!</h2>
        <p>Questions answered: {correctCount + incorrectCount}</p>
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {incorrectCount}</p>
        <p>
          Accuracy:{' '}
          {(
            (correctCount / (correctCount + incorrectCount || 1)) *
            100
          ).toFixed(1)}
          %
        </p>
        <button onClick={onQuit}>Back to Main Menu</button>
      </div>
    );
  }

  return (
    <div key={animKey} className="game-box fade-in main-column" style={{ flexDirection: 'column' }}>
      <StreakCounter streak={streak} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <select value={poolKey} onChange={(e) => setPoolKey(e.target.value)}>
          <option value="first9">A–I</option>
          <option value="second9">J–R</option>
          <option value="third">S–Z</option>
          <option value="all">A–Z</option>
        </select>
        <select value={caseMode} onChange={(e) => setCaseMode(e.target.value)}>
          <option value="upper">Uppercase</option>
          <option value="lower">Lowercase</option>
          <option value="mixed">Mixed Case</option>
        </select>
      </div>

      <img src={`/assets/fox-${foxMood}.png`} alt="Fox" className="mascot" />
      <h1>Which letter is this?</h1>
      <div className="button-group">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            disabled={disabled}
            className={
              disabled ? (opt === current ? 'correct' : 'incorrect') : ''
            }
          >
            {renderLetter(opt)}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <button
          onClick={() => new Audio(sounds[current]).play()}
          disabled={disabled}
          style={{
            background: '#fff',
            padding: '0.5rem 1rem',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <img
            src="/assets/replay.png"
            alt="Replay"
            style={{ width: '24px', height: '24px' }}
          />
          Replay
        </button>
        <button
          onClick={() => setShowSummary(true)}
          disabled={disabled}
          style={{
            background: '#eee',
            padding: '0.5rem 1.5rem',
            fontSize: '1.5rem',
          }}
        >
          Quit
        </button>
      </div>
      <div
        style={{
          marginTop: '1rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        ✅ {correctCount}  ❌ {incorrectCount}
      </div>
    </div>
  );
}
