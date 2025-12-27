import { motion } from 'framer-motion';
import { useState } from 'react';

import trampolineZone from '@/assets/trampoline-zone.png';
import junglePlayground from '@/assets/jungle-playground.png';
import basketballZone from '@/assets/basketball-zone.png';
import bubbleBalls from '@/assets/bubble-balls.png';
import obstacleZone from '@/assets/obstacle-zone.png';

const images = [
  { src: trampolineZone, title: 'Neon Trampoline Zone', subtitle: 'Defy Gravity' },
  { src: junglePlayground, title: 'Jungle Adventure', subtitle: 'Wild Exploration' },
  { src: basketballZone, title: 'Slam Dunk Arena', subtitle: 'Bounce & Score' },
  { src: bubbleBalls, title: 'Bubble Ball Battle', subtitle: 'Epic Collisions' },
  { src: obstacleZone, title: 'Obstacle Course', subtitle: 'Test Your Limits' },
];

const ImageGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative">
      {/* Main Featured Image */}
      <motion.div 
        key={activeIndex}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-premium group"
      >
        <img 
          src={images[activeIndex].src}
          alt={images[activeIndex].title}
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
              {images[activeIndex].subtitle}
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-foreground">
              {images[activeIndex].title}
            </h3>
          </motion.div>
        </div>
      </motion.div>

      {/* Thumbnail Strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, idx) => (
          <motion.button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${
              idx === activeIndex 
                ? 'ring-2 ring-primary shadow-neon' 
                : 'ring-1 ring-border/40 opacity-60 hover:opacity-100'
            }`}
          >
            <img 
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {idx === activeIndex && (
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
