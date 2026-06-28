import { motion } from 'framer-motion';
import { useWaiverImages } from '@/hooks/useContent';

// Layout metadata; image src is pulled from Firestore (waiverImages) by section id.
const LAYOUT = [
  { id: 'welcome', delay: 0, position: 'top-20 right-10', size: 'w-32 h-24 md:w-48 md:h-36' },
  { id: 'eligibility', delay: 0.5, position: 'top-40 right-32', size: 'w-28 h-20 md:w-40 md:h-28' },
  { id: 'risks', delay: 1, position: 'bottom-40 right-16', size: 'w-36 h-24 md:w-52 md:h-36' },
  { id: 'medical', delay: 1.5, position: 'bottom-20 right-40', size: 'w-24 h-18 md:w-36 md:h-24' },
];

const FloatingImages = () => {
  const { data: waiverImages = [] } = useWaiverImages();
  const images = LAYOUT.map((l) => ({
    ...l,
    src: waiverImages.find((w) => w.id === l.id)?.image ?? '',
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden lg:block">
      {images.map((image, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ 
            opacity: 0.4, 
            scale: 1, 
            rotate: [0, 3, -3, 0],
            y: [0, -15, 0]
          }}
          transition={{ 
            delay: image.delay,
            duration: 1,
            rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }
          }}
          className={`absolute ${image.position} ${image.size} rounded-2xl overflow-hidden shadow-premium`}
        >
          <img 
            src={image.src}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute inset-0 border border-primary/20 rounded-2xl" />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingImages;
