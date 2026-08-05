import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useGallery } from '@/hooks/useContent';

// Minimal placeholder so the carousel renders before Firestore responds.
const PLACEHOLDER = [{ id: 'placeholder', image: '', title: 'HavFun', subtitle: 'Loading…' }];

const ImageGallery = () => {
  const { data } = useGallery();
  const images = data && data.length ? data : PLACEHOLDER;
  const [activeIndex, setActiveIndex] = useState(0);

  // Keep index in range if the list length changes after load.
  const safeIndex = activeIndex % images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  return (
    <div className="relative">
      {/* Main Featured Image */}
      <motion.div
        key={safeIndex}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-premium group"
      >
        <img
          src={images[safeIndex].image}
          alt={images[safeIndex].title}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />

        {/* Neon Border Glow */}
        <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 pointer-events-none" />
        <motion.div
          className="absolute inset-0 rounded-3xl border border-primary/50"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.div
            key={`content-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-2">
              {images[safeIndex].subtitle}
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-foreground">
              {images[safeIndex].title}
            </h3>
          </motion.div>
        </div>
      </motion.div>

      {/* Thumbnail Strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, idx) => (
          <motion.button
            key={image.id}
            onClick={() => setActiveIndex(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${idx === safeIndex
              ? 'ring-2 ring-primary shadow-neon'
              : 'ring-1 ring-border/40 opacity-60 hover:opacity-100'
              }`}
          >
            <img
              src={image.image}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {idx === safeIndex && (
              <motion.div
                layoutId="activeThumb"
                className="absolute inset-0 bg-primary/10"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
