// src/components/StreakCounter.jsx
import React from 'react';
import './StreakCounter.css';

export default function StreakCounter({ streak }) {
  if (streak < 2) return null;

  let className = 'streak-counter';
  if (streak >= 10) className += ' intense';
  else if (streak >= 5) className += ' strong';
  else className += ' mild';

  return (
    <div className={className}>
      🔥 Streak: {streak}
    </div>
  );
}