import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, X, ChevronUp, Volume1 } from 'lucide-react';
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { Slider } from '@/components/ui/slider';
import songFile from "@/assets/3-Sirivennala.mp3";


// Birthday playlist with royalty-free audio URLs
const playlist = [
   {
      id: 1,
      title: "Killing Jija – Animal BGM",
      artist: "Harshavardhan Rameshwar",
      url: "https://www.bgmringtones.com/wp-content/uploads/2023/10/Killing-Jeeja-Bgm.mp3", // upload or replace with legal source
      mood: "powerful"
    },
  
    // 🎂 Birthday Song
    {
      id: 2,
      title: "Happy Birthday Telugu",
      artist: "Traditional",
      url: "https://www.orangefreesounds.com/wp-content/uploads/2016/08/Happy-birthday-instrumental.mp3",
      mood: "celebration"
    },
    {
      id: 3,
      title: "Happy Birthday Telugu",
      artist: "Traditional",
      url: songFile,
      mood: "celebration"
    },
  
   
  ];

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTrack: number;
  nextTrack: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  playlist: typeof playlist;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicProvider');
  }
  return context;
};

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(playlist[currentTrack].url);
    audioRef.current.volume = isMuted ? 0 : volume;
    
    const audio = audioRef.current;

    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(console.error);
    }

    return () => {
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

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setIsPlaying(false);
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setTimeout(() => setIsPlaying(true), 100);
  };
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        togglePlay,
        currentTrack,
        nextTrack,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        playlist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

function VolumeSlider() {
  const { volume, setVolume, isMuted, toggleMute } = useMusicPlayer();

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-4 h-4 text-muted-foreground" />;
    if (volume < 0.5) return <Volume1 className="w-4 h-4 text-foreground" />;
    return <Volume2 className="w-4 h-4 text-foreground" />;
  };

  return (
    <div className="flex items-center gap-3 mb-4 px-1">
      <motion.button
        onClick={toggleMute}
        className="p-1.5 rounded-full hover:bg-muted/50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {getVolumeIcon()}
      </motion.button>
      <Slider
        value={[isMuted ? 0 : volume * 100]}
        onValueChange={(values) => {
          const newVolume = values[0] / 100;
          setVolume(newVolume);
          if (newVolume > 0 && isMuted) {
            toggleMute();
          }
        }}
        max={100}
        step={1}
        className="flex-1"
      />
      <span className="text-xs text-muted-foreground w-8 text-right">
        {isMuted ? '0' : Math.round(volume * 100)}%
      </span>
    </div>
  );
}

export default function MiniMusicPlayer() {
  const {
    isPlaying,
    togglePlay,
    currentTrack,
    nextTrack,
    isMuted,
    toggleMute,
    playlist,
  } = useMusicPlayer();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <motion.button
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg"
        onClick={() => setIsVisible(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Music className="w-5 h-5 text-primary-foreground" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            className="glass-card p-4 w-72"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Now Playing
              </span>
              <div className="flex gap-1">
                <motion.button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full hover:bg-muted/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronUp className="w-4 h-4 text-muted-foreground rotate-180" />
                </motion.button>
                <motion.button
                  onClick={() => setIsVisible(false)}
                  className="p-1.5 rounded-full hover:bg-muted/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Track Info with Animation */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-2xl">🎵</span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate text-sm">
                  {playlist[currentTrack].title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {playlist[currentTrack].artist}
                </p>
              </div>
            </div>

            {/* Sound Waves */}
            <div className="flex items-center justify-center gap-0.5 h-8 mb-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full"
                  animate={isPlaying ? {
                    height: [4, 20, 8, 24, 4],
                  } : { height: 4 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            {/* Volume Slider */}
            <VolumeSlider />

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <motion.button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-muted/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-foreground" />
                )}
              </motion.button>

              <motion.button
                onClick={togglePlay}
                className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                )}
              </motion.button>

              <motion.button
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-muted/50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <SkipForward className="w-4 h-4 text-foreground" />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mini"
            className="glass-card p-2 flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Mini album art */}
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center cursor-pointer"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              onClick={() => setIsExpanded(true)}
            >
              <span className="text-lg">🎵</span>
            </motion.div>

            {/* Mini controls */}
            <motion.button
              onClick={togglePlay}
              className="p-2 rounded-full bg-gradient-to-r from-primary to-secondary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
              )}
            </motion.button>

            <motion.button
              onClick={nextTrack}
              className="p-2 rounded-full hover:bg-muted/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-4 h-4 text-foreground" />
            </motion.button>

            <motion.button
              onClick={() => setIsExpanded(true)}
              className="p-2 rounded-full hover:bg-muted/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </motion.button>

            <motion.button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-full hover:bg-muted/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
