import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => (
  <div className="fixed top-0 left-0 w-full h-1.5 bg-muted z-50">
    <motion.div 
      className="h-full bg-gradient-neon"
      initial={{ width: 0 }}
      animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    />
  </div>
);

export default ProgressBar;
