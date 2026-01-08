import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, MapPin, Heart, Users } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800">
        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(at 40% 20%, rgb(217, 119, 6) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgb(251, 146, 60) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgb(245, 158, 11) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgb(217, 119, 6) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgb(194, 65, 12) 0px, transparent 50%),
            radial-gradient(at 80% 100%, rgb(180, 83, 9) 0px, transparent 50%),
            radial-gradient(at 0% 0%, rgb(217, 119, 6) 0px, transparent 50%)`,
        }}></div>
      </div>

      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="relative w-full flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-50"></div>
                <BookOpen className="w-28 h-28 mx-auto relative z-10 text-amber-200 drop-shadow-2xl" />
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-12 h-12 text-yellow-300" />
              </motion.div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent"
            >
              Yerel Hikayeler
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-amber-100 mb-8 leading-relaxed"
            >
              Hikayelerinizi paylaşın, topluluğunuzla bağlantı kurun ve unutulmaz anıları birlikte yaşayın.
            </motion.p>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-8 mt-12"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                  <MapPin className="w-6 h-6 text-amber-200" />
                </div>
                <span className="text-sm text-amber-200">Yerel Keşif</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                  <Heart className="w-6 h-6 text-orange-200" />
                </div>
                <span className="text-sm text-amber-200">Anı Paylaşımı</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full">
                  <Users className="w-6 h-6 text-yellow-200" />
                </div>
                <span className="text-sm text-amber-200">Topluluk</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              {subtitle && (
                <p className="text-amber-100">{subtitle}</p>
              )}
            </motion.div>
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;


