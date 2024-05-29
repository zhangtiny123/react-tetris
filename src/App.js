import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const ROWS = 20;
const COLS = 10;
const TETROMINOS = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: { shape: [[1, 1, 1, 1]], color: '80, 227, 230' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '36, 95, 223' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '223, 173, 36' },
  O: { shape: [[1, 1], [1, 1]], color: '223, 217, 36' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '48, 211, 56' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '132, 61, 198' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '227, 78, 78' },
};

const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

const App = () => {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill([0, 'clear'])));
  const [tetromino, setTetromino] = useState(randomTetromino());
  const [position, setPosition] = useState({ x: 0, y: 0, x_prev: -1, y_prev: -1 });

  const drawTetromino = useCallback((newBoard) => {
    if (position.x_prev >= 0 && position.y_prev >= 0) {
      tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newBoard[y + position.y_prev][x + position.x_prev] = [0, 'clear'];
          }
        });
      });
    }
    tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[y + position.y][x + position.x] = [
            value,
            `rgba(${tetromino.color}, 0.8)`,
          ];
        }
      });
    });
    setBoard(newBoard);
  }, [tetromino, position]);

  useEffect(() => {
    const newBoard = [...board];
    drawTetromino(newBoard);
  }, [position, drawTetromino]);

  const moveTetromino = ({ x, y }) => {
    setPosition((prev) => ({
      x: prev.x + x,
      y: prev.y + y,
      x_prev: prev.x,
      y_prev: prev.y,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      moveTetromino({ x: -1, y: 0 });
    } else if (e.key === 'ArrowRight') {
      moveTetromino({ x: 1, y: 0 });
    } else if (e.key === 'ArrowDown') {
      moveTetromino({ x: 0, y: 1 });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      <div className="board">
        {board.map((row, y) =>
          row.map((cell, x) => {
            return (
              <div
                key={`${x}-${y}`}
                className="cell"
                style={{
                  backgroundColor: cell[1] === "clear" ? "rgba(0,0,0, 0.8)" : cell[1],
                }}
              />
            )
          })
        )}
      </div>
    </div>
  );
};

export default App;