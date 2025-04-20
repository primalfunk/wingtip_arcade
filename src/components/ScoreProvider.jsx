import React, { createContext, useContext, useState } from "react";

const ScoreContext = createContext();
export function useScore() {
  return useContext(ScoreContext);
}

export function ScoreProvider({ children }) {
  const [score, setScore] = useState(0);
  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
}