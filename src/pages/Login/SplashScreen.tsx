import { motion } from 'framer-motion';
import './SplashScreen.css';

interface SplashScreenProps {
  isActive: boolean;
}

export function SplashScreen({ isActive }: SplashScreenProps) {
  if (!isActive) {
    return null;
  }

  return (
    <motion.p
      className="splash-screen__tagline"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      A unified platform to manage patient inquiries and clinic operations
    </motion.p>
  );
}
