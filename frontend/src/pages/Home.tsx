import { useAuth } from '../contexts/AuthContext';
import { Container } from '../components/layout';
import { HeroSection, FeatureCard, CTASection } from '../components/sections';
import { BookOpen, MapPin, Users, Share2, Heart, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Home Page Component - Ana sayfa
 * Modern hero section, feature cards ve CTA ile yeniden tasarlandı
 */
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Container className="py-16 md:py-24">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              Neler Sunuyoruz?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Yerel hikayelerinizi paylaşmak ve keşfetmek için ihtiyacınız olan her şey burada
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={BookOpen}
            title="Hikayeleri Keşfet"
            description="Topluluğun paylaştığı yerel hikayeleri okuyun, beğenin ve yorum yapın. Her hikaye size yeni bir bakış açısı kazandırır."
            link="/stories"
            linkText="Tüm hikayeleri gör →"
            delay={0.1}
          />
          <FeatureCard
            icon={Share2}
            title="Hikaye Paylaş"
            description="Kendi yerel hikayenizi paylaşın ve topluluğa katkıda bulunun. Fotoğraflar, konum ve kategorilerle hikayenizi zenginleştirin."
            link={isAuthenticated ? "/create-story" : "/register"}
            linkText={isAuthenticated ? "Hikaye oluştur →" : "Kayıt ol ve başla →"}
            delay={0.2}
          />
          <FeatureCard
            icon={MapPin}
            title="Harita Üzerinde Gör"
            description="Hikayelerin konumlarını harita üzerinde görselleştirin. Yeni yerler keşfedin ve ilginç lokasyonları ziyaret edin."
            link="/stories"
            linkText="Haritayı gör →"
            delay={0.3}
          />
          <FeatureCard
            icon={Users}
            title="Topluluk"
            description="Benzer ilgi alanlarına sahip kullanıcılarla bağlantı kurun. Yorumlar ve beğenilerle etkileşime geçin."
            delay={0.4}
          />
          <FeatureCard
            icon={Heart}
            title="Beğeni Sistemi"
            description="Beğendiğiniz hikayeleri işaretleyin ve favorilerinizi oluşturun. En popüler hikayeleri keşfedin."
            delay={0.5}
          />
          <FeatureCard
            icon={Globe}
            title="Kategoriler"
            description="Tarihi yerler, doğa, kültür, yemek ve daha fazlası. İlgi alanınıza göre hikayeleri filtreleyin."
            delay={0.6}
          />
        </div>
      </Container>

      {/* CTA Section - Sadece giriş yapmamış kullanıcılar için */}
      {!isAuthenticated && (
        <Container className="py-16">
          <CTASection />
        </Container>
      )}
    </div>
  );
};

export default Home;

