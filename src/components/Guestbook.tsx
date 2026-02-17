import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircleHeart, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface GuestbookProps {
  isOpen: boolean;
  onClose: () => void;
  birthdayName: string;
}

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  emoji: string;
  created_at: string;
}

const emojiOptions = ['🎂', '🎉', '💖', '🌟', '🎈', '🥳', '✨', '💝'];

export default function Guestbook({ isOpen, onClose, birthdayName }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎂');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEntries();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('guestbook-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'guestbook',
          },
          (payload) => {
            setEntries(prev => [payload.new as GuestbookEntry, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen]);

  const fetchEntries = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setEntries(data);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from('guestbook')
      .insert({
        name: name.trim(),
        message: message.trim(),
        emoji: selectedEmoji,
      });

    if (!error) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f9a8d4', '#fcd34d', '#a78bfa'],
      });
      setName('');
      setMessage('');
      setSelectedEmoji('🎂');
    }
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
          >
            <div className="glass-card p-6 md:p-8 w-full max-w-2xl h-full max-h-[90vh] md:max-h-[80vh] flex flex-col">
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center gap-2 mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircleHeart className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-display text-gradient">
                  Birthday Wishes for {birthdayName}
                </h2>
                <p className="text-muted-foreground mt-2">
                  Leave a special message! 💝
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-muted focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <div className="flex gap-1">
                    {emojiOptions.slice(0, 4).map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-10 h-10 rounded-lg text-xl ${
                          selectedEmoji === emoji 
                            ? 'bg-primary/30 border-2 border-primary' 
                            : 'bg-muted/30 hover:bg-muted/50'
                        } transition-all`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <textarea
                    placeholder={`Write your birthday wish for ${birthdayName}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={500}
                    rows={2}
                    className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-muted focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                    required
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !message.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Entries */}
              <div className="flex-1 overflow-auto space-y-3 pr-2">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : entries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No wishes yet. Be the first to leave one! 🎉</p>
                  </div>
                ) : (
                  entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-muted/30 border border-muted/50"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{entry.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-champagne">{entry.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(entry.created_at)}
                            </span>
                          </div>
                          <p className="text-foreground/90 break-words">{entry.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
