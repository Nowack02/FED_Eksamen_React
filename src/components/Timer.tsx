import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialMinutes: number;
  isRunning: boolean;
  onTimerStop: (timeSpentSeconds: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ initialMinutes, isRunning, onTimerStop }) => {
  const initialSeconds = initialMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (secondsLeft <= 0) {
      onTimerStop(initialSeconds);
      return;
    }
    
    const intervalId = setInterval(() => {
      setSecondsLeft(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);

  }, [isRunning, secondsLeft, initialSeconds, onTimerStop]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className={`timer ${secondsLeft < 60 ? 'low-time' : ''}`}>
      <h2>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h2>
    </div>
  );
};