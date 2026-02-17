import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Upload, Camera } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import memory1 from '@/assets/memory-1.jpeg';
import memory2 from '@/assets/memory-2.jpeg';
import memory3 from '@/assets/memory-3.jpeg';
import memory4 from '@/assets/memory-4.jpeg';

interface MemoryGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadedPhoto {
  id: string;
  uploader_name: string;
  caption: string | null;
  file_url: string;
  created_at: string;
}

const defaultMemories = [
  {
    id: 'default-1',
    src: memory1,
    caption: "That magical all together 🌅 your daughter",
    uploaderName: null,
  },
  {
    id: 'default-2',
    src: memory2,
    caption: "The birthday party that started it all! 🎂",
    uploaderName: null,
  },
  {
    id: 'default-3',
    src: memory3,
    caption: "Our unforgettable time together with your daughter🏔️",
    uploaderName: null,
  },
  {
    id: 'default-4',
    src: memory4,
    caption: "Our unforgettable moment together with your daughter 🏔️",
    uploaderName: null,
  },
];

export default function MemoryGallery({ isOpen, onClose }: MemoryGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine default memories with uploaded photos
  const allMemories = [
    ...defaultMemories,
    ...uploadedPhotos.map(photo => ({
      id: photo.id,
      src: photo.file_url,
      caption: photo.caption || '📸 A special moment',
      uploaderName: photo.uploader_name,
    }))
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPhotos();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('memory-photos-changes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'memory_photos' },
          (payload) => {
            const newPhoto = payload.new as UploadedPhoto;
            setUploadedPhotos(prev => [...prev, newPhoto]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen]);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('memory_photos')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching photos:', error);
      return;
    }
    
    setUploadedPhotos(data || []);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!uploaderName.trim()) {
      toast.error('Please enter your name first!');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('memory-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memory-photos')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('memory_photos')
        .insert({
          uploader_name: uploaderName.trim(),
          caption: caption.trim() || null,
          file_path: filePath,
          file_url: publicUrl,
        });

      if (dbError) throw dbError;

      toast.success('Photo uploaded! 📸');
      setShowUploadForm(false);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (selectedMemory !== null) {
      setSelectedMemory((selectedMemory + 1) % allMemories.length);
    }
  };

  const handlePrev = () => {
    if (selectedMemory !== null) {
      setSelectedMemory((selectedMemory - 1 + allMemories.length) % allMemories.length);
    }
  };

  const getRotation = (index: number) => {
    const rotations = [-5, 3, -2, 4, -3, 2, -4, 5];
    return rotations[index % rotations.length];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/90 backdrop-blur-lg z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Gallery */}
          <motion.div
            className="fixed inset-4 md:inset-10 z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display text-gradient">
                📸 Our Memories
              </h2>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm font-medium hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload className="w-4 h-4" />
                  Add Photo
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/50 transition-colors glass-card"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Upload Form */}
            <AnimatePresence>
              {showUploadForm && (
                <motion.div
                  className="glass-card p-4 rounded-xl mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm text-muted-foreground mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={uploaderName}
                        onChange={(e) => setUploaderName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-muted focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm text-muted-foreground mb-1">Caption (optional)</label>
                      <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-muted focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="photo-upload"
                      />
                      <motion.label
                        htmlFor="photo-upload"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                          isUploading || !uploaderName.trim()
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                        whileHover={!isUploading && uploaderName.trim() ? { scale: 1.05 } : {}}
                        whileTap={!isUploading && uploaderName.trim() ? { scale: 0.95 } : {}}
                      >
                        <Camera className="w-4 h-4" />
                        {isUploading ? 'Uploading...' : 'Choose Photo'}
                      </motion.label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Polaroid Grid */}
            <div className="flex-1 overflow-auto">
              <div className="flex flex-wrap gap-6 justify-center items-start py-4">
                {allMemories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    className="polaroid cursor-pointer relative"
                    style={{ '--rotation': `${getRotation(index)}deg` } as React.CSSProperties}
                    initial={{ opacity: 0, y: 50, rotate: getRotation(index) }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      rotate: getRotation(index),
                    }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: 0,
                      zIndex: 10,
                    }}
                    onClick={() => setSelectedMemory(index)}
                  >
                    <img 
                      src={memory.src} 
                      alt={memory.caption}
                      className="w-40 h-52 md:w-48 md:h-60 object-cover"
                    />
                    <div className="absolute bottom-2 left-0 right-0 px-2">
                      <p className="text-center text-midnight text-xs md:text-sm font-medium line-clamp-2">
                        {memory.caption}
                      </p>
                      {memory.uploaderName && (
                        <p className="text-center text-midnight/60 text-xs mt-1">
                          — {memory.uploaderName}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Fullscreen View */}
          <AnimatePresence>
            {selectedMemory !== null && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMemory(null)}
              >
                <motion.button
                  className="absolute left-4 p-3 glass-card rounded-full"
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>

                <motion.div
                  className="polaroid max-w-sm md:max-w-lg"
                  style={{ '--rotation': '0deg' } as React.CSSProperties}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={allMemories[selectedMemory].src} 
                    alt={allMemories[selectedMemory].caption}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 px-4">
                    <p className="text-center text-midnight text-lg font-medium">
                      {allMemories[selectedMemory].caption}
                    </p>
                    {allMemories[selectedMemory].uploaderName && (
                      <p className="text-center text-midnight/60 text-sm mt-1">
                        — {allMemories[selectedMemory].uploaderName}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.button
                  className="absolute right-4 p-3 glass-card rounded-full"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
