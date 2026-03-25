import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 gap-8">
        <header className="text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tighter neon-text-cyan mb-2"
          >
            NEON RHYTHM
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 font-sans tracking-widest uppercase text-sm"
          >
            Sync your moves to the beat
          </motion.p>
        </header>

        <main className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          {/* Left Side: Stats (Desktop) */}
          <div className="hidden lg:flex flex-col gap-4 w-64">
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-cyan-400">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-1">High Score</h4>
              <p className="text-3xl font-display neon-text-cyan">{highScore}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-pink-500">
              <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Status</h4>
              <p className="text-xl font-display text-pink-500">SYSTEM ONLINE</p>
            </div>
          </div>

          {/* Center: Snake Game */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-2 rounded-3xl neon-border"
          >
            <SnakeGame onScoreChange={handleScoreChange} />
          </motion.div>

          {/* Right Side: Music Player */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-md"
          >
            <MusicPlayer />
          </motion.div>
        </main>

        <footer className="mt-8 text-gray-600 text-xs uppercase tracking-[0.3em]">
          &copy; 2026 Cyber-Rhythm Systems
        </footer>
      </div>
    </div>
  );
}
