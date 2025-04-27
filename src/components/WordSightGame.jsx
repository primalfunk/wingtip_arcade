// src/components/WordSightGame.jsx
import React, { useState, useEffect } from 'react';
import { ScoreProvider, useScore } from './ScoreProvider';
import ScoreCounter from './ScoreCounter';
import { shuffle, getWordOptions } from './utils';
import confetti from 'canvas-confetti';
import StreakCounter from './StreakCounter';

export default function WordSightGameWrapper({ onExit }) {
  const [mode, setMode] = useState('mixed'); // two-letter, three-letter, or mixed

  // Word pools
  const twoLetterWords = ['is', 'am', 'so', 'do', 'go', 'me', 'no', 'us', 'up', 'be', 'on', 'at', 'it', 'in', 'to'];
  const threeLetterWords = [
    'pot', 'mom', 'log', 'sit', 'kit', 'lip', 'pig', 'fig', 'dig', 'big',
    'fed', 'led', 'pet', 'ten', 'net', 'red', 'bed', 'fan', 'man', 'can', 'hat', 'mat', 'bat', 'dog', 'cat'
  ];

  const wordPools = {
    two: twoLetterWords,
    three: threeLetterWords,
    mixed: [...twoLetterWords, ...threeLetterWords],
  };

  return (
    <ScoreProvider>
      <div className="app-container">
        <div className="game-box fade-in">
          <WordFlashcardGame
            mode={mode}
            setMode={setMode}
            wordPools={wordPools}
            onQuit={onExit}
          />
        </div>
      </div>
    </ScoreProvider>
  );
}

function WordFlashcardGame({ mode, setMode, wordPools, onQuit }) {
  const words = wordPools[mode];
  const sounds = words.reduce((o, w) => {
    o[w] = `/assets/${w}.mp3`;
    return o;
  }, {});
  sounds.hit = '/assets/hit.mp3';
  sounds.miss = '/assets/miss.mp3';

  const [queue, setQueue] = useState(() => shuffle(words));
  const [current, setCurrent] = useState(queue[0]);
  const [options, setOptions] = useState(() => getWordOptions(words, current, 4)); // choose 4 choices
  const [disabled, setDisabled] = useState(false);
  const [foxMood, setFoxMood] = useState('neutral');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { setScore } = useScore();
  
  useEffect(() => {
    const newQueue = shuffle(wordPools[mode]);
    const firstWord = newQueue[0];
  
    setQueue(newQueue);
    setCurrent(firstWord);
    setOptions(getWordOptions(wordPools[mode], firstWord, 4));
    setStreak(0); // Reset streak
    setCorrectCount(0); // Optional: reset score counts if you want
    setIncorrectCount(0);
    setAnimKey((k) => k + 1);
    setHasStarted(false); // Back to "Ready to Play?" screen
  }, [mode]);

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
        const newQueue = rest.length > 0 ? rest : shuffle(wordPools[mode]);
        const next = newQueue[0];
        setCurrent(next);
        setOptions(getWordOptions(wordPools[mode], next, 4));

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
      <div className="game-box fade-in">
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
      <div className="game-box fade-in">
        <img src="/assets/fox-neutral.png" alt="Fox mascot" className="mascot" />
        <h2>Great job!</h2>
        <p>Questions answered: {correctCount + incorrectCount}</p>
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {incorrectCount}</p>
        <p>
          Accuracy: {((correctCount / (correctCount + incorrectCount || 1)) * 100).toFixed(1)}%
        </p>
        <button onClick={onQuit}>Back to Main Menu</button>
      </div>
    );
  }

  return (
    <div key={animKey} className="game-box fade-in main-column">
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
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="two">Two-Letter Words</option>
          <option value="three">Three-Letter Words</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <img src={`/assets/fox-${foxMood}.png`} alt="Fox" className="mascot" />
      <h1>Which word is this?</h1>

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
            {opt}
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
