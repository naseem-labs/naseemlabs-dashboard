import { motion } from 'framer-motion';
import './Logo.css';

interface LogoProps {
  size?: 'splash' | 'header';
  layoutId?: string;
}

export function Logo({ size = 'header', layoutId }: LogoProps) {
  return (
    <motion.div
      className={`logo logo--${size}`}
      layoutId={layoutId}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="logo__title">NaseemLabs</h1>
      <p className="logo__subtitle">PATIENT INQUIRY SYSTEM</p>
      <span className="logo__accent" aria-hidden="true" />
    </motion.div>
  );
}
