import RPLogo2_0 from './assets/RPLogo2_0.png';
import React, { useState } from 'react';
import './styles.css';



export default function App() {
  const MIN = 1;
  const MAX = 100;
  const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * MAX) + MIN);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>(`Guess a number between ${MIN} and ${MAX}`);
  const [attempts, setAttempts] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const sendData = (data: any) => {
    if (typeof window.sendDataToGameLab === 'function') {
      window.sendDataToGameLab(data);
    }
  };

  const handleGuess = () => {
    const n = parseInt(guess, 10);
    if (isNaN(n)) {
      setMessage('Please enter a valid number.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result: string;
    if (n < target) {
      result = 'low';
      setMessage('Too low! Try again.');
    } else if (n > target) {
      result = 'high';
      setMessage('Too high! Try again.');
    } else {
      result = 'correct';
      setMessage(`Correct! You guessed it in ${newAttempts} attempts!`);
      setIsCorrect(true);
    }

    sendData({ event: 'guess', guess: n, result, attempts: newAttempts, timestamp: new Date().toISOString() });
    setGuess('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isCorrect) {
      handleGuess();
    }
  };

  const resetGame = () => {
    const newTarget = Math.floor(Math.random() * MAX) + MIN;
    setTarget(newTarget);
    setAttempts(0);
    setGuess('');
    setIsCorrect(false);
    setMessage(`Guess a number between ${MIN} and ${MAX}`);
    sendData({ event: 'reset', timestamp: new Date().toISOString() });
  };

  return (
    <div className="App">
      <img src={RPLogo2_0} alt="RPLogo2.png" className="logo" />
      <h1>Number Guessing Game</h1>
      <p className="message">{message}</p>
      <div className="input-group">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCorrect}
          className="guess-input"
          placeholder={`${MIN}-${MAX}`}
        />
        <button onClick={handleGuess} disabled={isCorrect} className="guess-button">
          Guess
        </button>
      </div>
      {isCorrect && (
        <button onClick={resetGame} className="reset-button">
          Play Again
        </button>
      )}
    </div>
  );
}