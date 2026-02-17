import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import songFile from "@/assets/3-Sirivennala.mp3";

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Birthday playlist with royalty-free audio URLs
// These are placeholder URLs - replace with actual MP3 files in public/music/
const playlist = [
  {
    id: 1,
    title: "Killing Jija – Animal BGM",
    artist: "Harshavardhan Rameshwar",
    url: "https://www.bgmringtones.com/wp-content/uploads/2023/10/Killing-Jeeja-Bgm.mp3", // upload or replace with legal source
    mood: "powerful"
  },
  
  {
    id: 2,
    title: "Happy Birthday Telugu",
    artist: "Traditional",
    url: "https://www.orangefreesounds.com/wp-content/uploads/2016/08/Happy-birthday-instrumental.mp3",
    mood: "celebration"
  },
  
   // 🎂 Birthday Song
{
  id: 3,
  title: "Happy Birthday Telugu",
  artist: "Traditional",
  url: songFile,
  mood: "celebration"
},
  
   
  ];

export default function MusicPlayer({ isOpen, onClose }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(playlist[currentTrack].url);
    audioRef.current.volume = isMuted ? 0 : volume;
    
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTrack((currentTrack + 1) % playlist.length);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTrack((currentTrack - 1 + playlist.length) % playlist.length);
    setTimeout(() => setIsPlaying(true), 100);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audioRef.current.currentTime = percentage * duration;
    setProgress(percentage * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Player Modal */}
          <motion.div
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="glass-card p-6">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>

              {/* Album art placeholder */}
              <motion.div
                className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-5xl">🎵</span>
              </motion.div>

              {/* Track info */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-display text-gradient">
                  {playlist[currentTrack].title}
                </h3>
                <p className="text-muted-foreground">
                  {playlist[currentTrack].artist}
                </p>
              </div>

              {/* Sound waves visualization */}
              <div className="flex items-center justify-center gap-1 h-12 mb-6">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full"
                    animate={isPlaying ? {
                      height: [8, 32, 16, 40, 8],
                    } : { height: 8 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div 
                  className="h-2 bg-muted rounded-full cursor-pointer overflow-hidden"
                  onClick={handleProgressClick}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime((progress / 100) * duration)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={handlePrev}
                  className="p-3 rounded-full hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipBack className="w-6 h-6 text-foreground" />
                </motion.button>

                <motion.button
                  onClick={handlePlayPause}
                  className="p-4 rounded-full bg-gradient-to-r from-primary to-secondary"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-primary-foreground" />
                  ) : (
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  )}
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  className="p-3 rounded-full hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <SkipForward className="w-6 h-6 text-foreground" />
                </motion.button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <motion.button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-foreground" />
                  )}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-24 h-2 rounded-full appearance-none bg-muted cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                />
              </div>

              {/* Playlist */}
              <div className="mt-6 space-y-2 max-h-32 overflow-auto">
                {playlist.map((track, i) => (
                  <motion.button
                    key={track.id}
                    className={`w-full p-2 rounded-lg text-left transition-all flex items-center gap-3 ${
                      i === currentTrack 
                        ? 'bg-primary/20 border border-primary/50' 
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => {
                      setCurrentTrack(i);
                      setIsPlaying(true);
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-lg">{i === currentTrack && isPlaying ? '🎵' : '🎶'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${i === currentTrack ? 'text-primary' : 'text-foreground'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
