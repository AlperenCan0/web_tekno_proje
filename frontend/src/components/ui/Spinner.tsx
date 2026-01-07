import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  text,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Loader2 className={`${sizeStyles[size]} text-primary-600`} />
      </motion.div>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Spinner;





