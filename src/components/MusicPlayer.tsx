import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const DUMMY_TRACKS = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f3ff"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Digital Dreams",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Retro Future",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipTrack = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  return (
    <div className="glass-panel w-full max-w-md rounded-2xl p-6 neon-border">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => skipTrack('next')}
      />

      <div className="flex items-center gap-6">
        <motion.div 
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black/40 neon-box-cyan"
        >
          <Music className="h-10 w-10 text-cyan-400 neon-text-cyan" />
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <h3 
            className="truncate font-digital text-xl neon-text-cyan glitch" 
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
          <motion.div 
            className="h-full bg-cyan-400 neon-box-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-8">
        <button 
          onClick={() => skipTrack('prev')}
          className="text-cyan-400/60 transition-all hover:text-cyan-400 hover:scale-110 active:scale-95 neon-text-cyan"
        >
          <SkipBack size={28} fill="currentColor" className="opacity-80" />
        </button>

        <button 
          onClick={togglePlay}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-black transition-transform hover:scale-110 active:scale-95 neon-box-cyan shadow-[0_0_20px_rgba(0,243,255,0.5)]"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={() => skipTrack('next')}
          className="text-cyan-400/60 transition-all hover:text-cyan-400 hover:scale-110 active:scale-95 neon-text-cyan"
        >
          <SkipForward size={28} fill="currentColor" className="opacity-80" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3 text-cyan-400/40">
        <Volume2 size={18} className="neon-text-cyan" />
        <div className="h-1 flex-1 rounded-full bg-gray-800">
          <div className="h-full w-2/3 rounded-full bg-cyan-400/40 neon-box-cyan" />
        </div>
      </div>
    </div>
  );
}
