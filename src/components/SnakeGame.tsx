import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex w-full justify-between font-display text-xl">
        <div 
          className="font-digital text-2xl neon-text-cyan glitch" 
          data-text={`SCORE: ${score}`}
        >
          SCORE: {score}
        </div>
        <div 
          className={`font-digital text-xl glitch ${isPaused ? 'neon-text-pink' : 'text-cyan-400 opacity-50'}`}
          data-text={isPaused ? 'PAUSED' : 'PLAYING'}
        >
          {isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>

      <div 
        className="relative grid bg-black/50 neon-box-cyan"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-150 ${i === 0 ? 'bg-cyan-400 neon-box-cyan z-10' : 'bg-cyan-600/50'}`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x * 100) / GRID_SIZE}%`,
              top: `${(segment.y * 100) / GRID_SIZE}%`,
            }}
          />
        ))}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute bg-pink-500 rounded-full neon-box-pink"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {isGameOver ? (
                <>
                  <h2 className="mb-4 font-display text-6xl neon-text-pink glitch" data-text="GAME OVER">GAME OVER</h2>
                  <button
                    onClick={resetGame}
                    className="rounded-full border-2 border-cyan-400 px-12 py-3 font-display text-2xl text-cyan-400 transition-all hover:bg-cyan-400 hover:text-black hover:neon-box-cyan"
                  >
                    RETRY
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mb-4 font-display text-6xl neon-text-cyan glitch" data-text="PAUSED">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="rounded-full border-2 border-pink-500 px-12 py-3 font-display text-2xl text-pink-500 transition-all hover:bg-pink-500 hover:text-black hover:neon-box-pink"
                  >
                    RESUME
                  </button>
                  <p className="mt-4 text-sm text-gray-400">Press SPACE to toggle pause</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={() => direction !== 'DOWN' && setDirection('UP')} className="p-4 glass-panel rounded-lg active:neon-box-cyan">↑</button>
        <div />
        <button onClick={() => direction !== 'RIGHT' && setDirection('LEFT')} className="p-4 glass-panel rounded-lg active:neon-box-cyan">←</button>
        <button onClick={() => direction !== 'UP' && setDirection('DOWN')} className="p-4 glass-panel rounded-lg active:neon-box-cyan">↓</button>
        <button onClick={() => direction !== 'LEFT' && setDirection('RIGHT')} className="p-4 glass-panel rounded-lg active:neon-box-cyan">→</button>
      </div>
      
      <p className="mt-4 hidden text-sm text-gray-500 md:block">Use Arrow Keys to move • Space to Pause</p>
    </div>
  );
}
