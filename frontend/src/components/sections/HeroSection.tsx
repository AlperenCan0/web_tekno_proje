import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { Button } from '../ui';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { storiesApi, usersApi } from '../../services/api';

interface Statistics {
  storiesCount: number;
  usersCount: number;
  locationsCount: number;
}

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Paylaşın', 'Keşfedin'];
  const [stats, setStats] = useState<Statistics>({
    storiesCount: 0,
    usersCount: 0,
    locationsCount: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStatistics();
    // Her 2 saniyede bir kelimeyi değiştir
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    try {
      setIsLoadingStats(true);

      // Stories'i çek (public endpoint)
      const stories = await storiesApi.getAll(true);

      // Unique locations hesapla
      const uniqueLocations = new Set<string>();
      stories.forEach((story) => {
        if (story.locationName) {
          uniqueLocations.add(story.locationName);
        }
      });

      // Users sayısını çekmeye çalış (başarısız olursa 0 kullan)
      let usersCount = 0;
      try {
        const users = await usersApi.getAll();
        usersCount = users.length;
      } catch (error) {
        // Users endpoint'i public değilse, stories'den unique author sayısını kullan
        const uniqueAuthors = new Set<string>();
        stories.forEach((story) => {
          if (story.author?.id) {
            uniqueAuthors.add(story.author.id);
          }
        });
        usersCount = uniqueAuthors.size;
      }

      setStats({
        storiesCount: stories.length,
        usersCount: usersCount,
        locationsCount: uniqueLocations.size,
      });
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      // Hata durumunda varsayılan değerler
      setStats({
        storiesCount: 0,
        usersCount: 0,
        locationsCount: 0,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-xy"></div>
      
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
              Yerel Hikayeleri
              <span className="block h-[1.5em] overflow-hidden py-2 my-2 relative text-center" style={{ perspective: '400px' }}>
                <AnimatePresence initial={false}>
                  <motion.span
                    key={currentWord}
                    layout={false}
                    initial={{ rotateX: -90, y: '50%', opacity: 0 }}
                    animate={{ rotateX: 0, y: '0%', opacity: 1 }}
                    exit={{ rotateX: 90, y: '-50%', opacity: 0 }}
                    transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                    className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 absolute inset-x-0 mx-auto"
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'center center',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                    }}
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-purple-100 drop-shadow-md">
              Yerel hikayelerinizi paylaşın, topluluğunuzla bağlantı kurun ve unutulmaz anıları birlikte yaşayın.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            {isAuthenticated ? (
              <>
                <Link to="/create-story">
                  <Button size="lg" variant="secondary" className="!bg-white !text-blue-600 hover:!bg-gray-100 border-2 border-white shadow-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Hikaye Oluştur
                  </Button>
                </Link>
                <Link to="/stories">
                  <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white/10">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Hikayeleri Keşfet
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" variant="primary" className="!bg-white !text-blue-600 hover:!bg-gray-100 border-2 border-white">
                    Hemen Başla
                  </Button>
                </Link>
                <Link to="/stories">
                  <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white/10">
                    Hikayeleri Keşfet
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {isLoadingStats ? (
                  <span className="inline-block animate-pulse">...</span>
                ) : (
                  <motion.span
                    key={stats.storiesCount}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stats.storiesCount > 0 ? `${stats.storiesCount}+` : '0'}
                  </motion.span>
                )}
              </div>
              <div className="text-blue-200">Paylaşılan Hikaye</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {isLoadingStats ? (
                  <span className="inline-block animate-pulse">...</span>
                ) : (
                  <motion.span
                    key={stats.usersCount}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stats.usersCount > 0 ? `${stats.usersCount}+` : '0'}
                  </motion.span>
                )}
              </div>
              <div className="text-blue-200">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {isLoadingStats ? (
                  <span className="inline-block animate-pulse">...</span>
                ) : (
                  <motion.span
                    key={stats.locationsCount}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stats.locationsCount > 0 ? `${stats.locationsCount}+` : '0'}
                  </motion.span>
                )}
              </div>
              <div className="text-blue-200">Farklı Lokasyon</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16 fill-slate-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,80 350,40 600,60 C850,80 1050,40 1200,60 L1200,120 L0,120 Z" opacity="0.8" />
          <path d="M0,80 C200,100 400,60 600,80 C800,100 1000,60 1200,80 L1200,120 L0,120 Z" opacity="0.6" />
          <path d="M0,100 C250,120 450,80 600,100 C750,120 950,80 1200,100 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;

