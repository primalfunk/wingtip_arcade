import React, { useState, useCallback, useEffect } from "react";
import { ScoreProvider, useScore } from "./ScoreProvider";
import StreakCounter from "./StreakCounter";
import { shuffle, getOptions } from "./utils";
import confetti from "canvas-confetti";
import creatures from "../data/creatures";
import "../styles/mythicGame.css";

export default function MythicGameWrapper({ onExit }) {
  return (
    <ScoreProvider>
      <div className="app-container">
        <div className="game-box fade-in">
          <div className="mythic-content">
          <FlashcardGame onQuit={onExit} />
        </div>
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
  const flipSound = new Audio("/assets/flip.mp3");
  const hitSound = new Audio("/assets/hit.mp3");
  const [timeoutId, setTimeoutId] = useState(null);
  const [allowSkip, setAllowSkip] = useState(false);

  function buildNameOptions(correct) {
    const pool = creatures.map((c) => c.name);
    return getOptions(pool, correct.name);
  }

  function handleChoice(choice) {
    setDisabled(true);
    const isCorrect = choice === current.name;

    if (isCorrect) {
      hitSound.play();
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.3 },
      });
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setTimeout(nextCard, 1500);
    } else {
      setIncorrectCount((c) => c + 1);
      setStreak(0);
      setIsFlipped(true);
      flipSound.play();
      setTimeout(() => setAllowSkip(true), 1500);
      const id = setTimeout(() => {
        setIsFlipped(false);
        nextCard();
        cleanupSkipListener();
      }, 10000);
      setTimeoutId(id);
      window.addEventListener("mousedown", handleSkip);
      window.addEventListener("touchstart", handleSkip);
    }
  }

  function nextCard() {
    setQueue((prev) => {
      const rest = prev.slice(1);
      const newQueue = rest.length > 0 ? rest : shuffle(creatures);
      const next = newQueue[0];
      setCurrent(next);
      setOptions(buildNameOptions(next));
      return newQueue;
    });
    setAnimKey((k) => k + 1);
    setDisabled(false);
  }

  const handleSkip = useCallback(() => {
    if (!allowSkip) return;
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsFlipped(false);
    nextCard();
    cleanupSkipListener();
  }, [allowSkip, timeoutId]);

  function cleanupSkipListener() {
    window.removeEventListener("mousedown", handleSkip);
    window.removeEventListener("touchstart", handleSkip);
    setAllowSkip(false);
  }

  useEffect(() => {
    if (isFlipped) {
      window.addEventListener("mousedown", handleSkip);
      window.addEventListener("touchstart", handleSkip);
      return () => {
        window.removeEventListener("mousedown", handleSkip);
        window.removeEventListener("touchstart", handleSkip);
      };
    }
  }, [isFlipped, handleSkip]);

  if (showSummary) {
    return (
      <div className="game-box fade-in" style={{ flexDirection: 'column' }}>
        <h2>Great job!</h2>
        <p>Questions answered: {correctCount + incorrectCount}</p>
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {incorrectCount}</p>
        <p>
          Accuracy:{" "}
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
    <div key={animKey} className="game-box fade-in">
      <div className="game-content">
      <div className="content-block">
      <h1 className="prompt" style={{ textAlign: "center", marginBottom: "1rem" }}>
        Name the creature.
      </h1>
      </div>
      <div className="content-block">
      <div className="card-container">
        <div className={`card ${isFlipped ? "flipped" : ""}`}>
          <div className="card-front">
            <div className="card-panel">
              <img
                src={current.image}
                alt={current.name}
                className="creature-image"
              />
            <div className="culture-overlay">
              <div className="culture-text">{current.culture}</div>
              <div className="trait">{current.trait}</div>
            </div>
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
      </div>
      <div className="content-block">
      <div className="game-controls">
        <div className="button-group">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleChoice(opt)}
              disabled={disabled}
              className={
                disabled ? (opt === current.name ? "correct" : "incorrect") : ""
              }
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="answer-tracker">
          Correct: {correctCount} | Incorrect: {incorrectCount}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={() => setShowSummary(true)}
            disabled={disabled}
            style={{
              background: "#eee",
              padding: "0.5rem 1.5rem",
              fontSize: "1.5rem",
            }}
          >
            Quit
          </button>
        </div>
        <StreakCounter streak={streak} />
      </div>
      </div>
      </div>
    </div>
  );
}
