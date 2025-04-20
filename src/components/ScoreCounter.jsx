import React from "react";
import { useScore } from "./ScoreProvider";

export default function ScoreCounter() {
  const { score } = useScore();

  const style = {
    marginTop: '1rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    background: '#fffbe6',
    border: '2px solid #ffd166',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    display: 'inline-block',
  };

  return <div style={style}>{score}</div>;
}
