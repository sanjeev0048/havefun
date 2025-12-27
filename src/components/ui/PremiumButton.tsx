import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PremiumButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

const PremiumButton = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  disabled = false,
  className 
}: PremiumButtonProps) => {
  const variants = {
    primary: 'bg-gradient-neon text-primary-foreground shadow-neon hover:shadow-[0_0_50px_hsl(var(--neon-lime)/0.5)]',
    secondary: 'bg-card/80 backdrop-blur-xl border border-border/40 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary',
    ghost: 'bg-transparent border border-border/20 text-muted-foreground hover:text-foreground hover:border-primary/40',
  };

  return (
    <motion.button
      whileHover={!disabled ? { y: -3, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative px-8 py-4 rounded-full font-medium transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden',
        variants[variant],
        disabled && 'opacity-30 cursor-not-allowed grayscale',
        className
      )}
    >
      {variant === 'primary' && !disabled && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
        {children}
      </span>
    </motion.button>
  );
};

export default PremiumButton;
