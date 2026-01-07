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
    <Card hover className="h-full">
      <CardHeader>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600 mb-4">{description}</p>
        {link && (
          <a
            href={link}
            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors"
          >
            {linkText}
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


