import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, CardTitle } from '../ui';
import { LucideIcon } from 'lucide-react';

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  link,
  linkText = 'Daha fazla →',
  delay = 0,
}) => {
  const content = (
    <Card hover className="h-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        {link && (
          <a
            href={link}
            className="text-indigo-600 hover:text-purple-600 font-medium inline-flex items-center transition-all duration-200 hover:gap-2 group"
          >
            {linkText}
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        )}
      </CardBody>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {content}
    </motion.div>
  );
};

export default FeatureCard;


