// src/App.jsx
import React, { useState } from "react";
import AlphabetGame from "./components/AlphabetGame";
import PeriodicGame from "./components/PeriodicGame";
import DecimalGame from "./components/DecimalGame";
import MythicGame from "./components/MythicGame";
import WordSightGame from "./components/WordSightGame";
import EcosystemGame from "./components/EcosystemGame";
import './styles/mainMenu.css';

export default function App() {
  const [screen, setScreen] = useState("main"); // current view
  const [showAbout, setShowAbout] = useState(false); // toggle about section

  const gameOptions = [
    { label: "🎯 Alphabet Game", value: "alphabet" },
    { label: "🧠 Word Sight Game", value: "wordSight" },
    { label: "➗ Simple Multiplication", value: "decimal" },
    { label: "🧪 Periodic Table", value: "periodic" },
    { label: "🐉 Mythic Beasts & Legends", value: "mythic" },
    { label: "🦊 Foxes and Rabbits", value: "ecosystem" }, 
  ];

  const handleSelect = (e) => {
    const selected = e.target.value;
    if (selected !== "") setScreen(selected);
  };

  return (
    <div className="app-container">
      {screen === "main" && (
        <div className="title-screen">
          <img
            src="/assets/fox-neutral.png"
            alt="Fox mascot"
            className="mascot"
          />
          <h1>Wingtip Arcade</h1>

          <div className="game-grid">
            {gameOptions.map((opt) => (
              <button
                key={opt.value}
                className="game-btn"
                onClick={() => setScreen(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            className="about-btn"
            onClick={() => setShowAbout(!showAbout)}
          >
            {showAbout ? "⬆ Hide Info" : "ℹ About / Contact"}
          </button>

          {showAbout && (
            <div className="about-section">
              <p>
                Welcome! This site was created as a personal learning arcade for
                curious minds, starting with games for my kids. I believe
                learning should be playful, stress-free, and open to everyone.
              </p>
              <p>
                No tracking. No ads. No sales. Just fun and learning, free for
                you. You can reach me with questions at:{" "}
                <strong>jared.d.menard@gmail.com</strong>
              </p>
              <p>
                I built this with React.js, check out the code at:{" "}
                <strong>https://github.com/primalfunk/wingtip_arcade</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {screen === "alphabet" && (
        <AlphabetGame onExit={() => setScreen("main")} />
      )}
      {screen === "periodic" && (
        <PeriodicGame onExit={() => setScreen("main")} />
      )}
      {screen === "decimal" && <DecimalGame onExit={() => setScreen("main")} />}
      {screen === "mythic" && <MythicGame onExit={() => setScreen("main")} />}
      {screen === "wordSight" && (
        <WordSightGame onExit={() => setScreen("main")} />
      )}
      {screen === "ecosystem" && (
        <EcosystemGame onExit={() => setScreen("main")} />
      )}
    </div>
  );
}
