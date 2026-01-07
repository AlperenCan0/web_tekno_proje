import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Hikayenizi Paylaşmaya Hazır mısınız?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Topluluğumuza katılın ve yerel hikayelerinizi paylaşarak diğer insanlarla bağlantı kurun.
            </p>
            <Link to="/register">
              <Button size="lg" variant="success" className="bg-white text-blue-600 hover:bg-gray-100">
                Hemen Başla
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;

