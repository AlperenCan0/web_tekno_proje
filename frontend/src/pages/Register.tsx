import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/auth';
import { Input, Button } from '../components/ui';
import PasswordStrength from '../components/ui/PasswordStrength';
import { Mail, Lock, User, UserCircle, AlertCircle } from 'lucide-react';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';

/**
 * Register Page Component - Kullanıcı kayıt sayfası
 * Yeni kullanıcı kaydı oluşturulur
 */
const Register: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useFormValidation(
    { email: '', username: '', password: '', firstName: '', lastName: '' },
    {
      email: validationRules.email,
      username: validationRules.username(3),
      password: validationRules.password(6),
      firstName: validationRules.required,
      lastName: validationRules.required,
    },
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!termsAccepted) {
      setSubmitError('Kullanım şartlarını kabul etmelisiniz');
      return;
    }

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(
        values.email,
        values.username,
        values.password,
        values.firstName,
        values.lastName,
      );
      navigate('/');
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Hesap Oluşturun"
      subtitle="Topluluğumuza katılın ve hikayelerinizi paylaşmaya başlayın"
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-100">{submitError}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            type="text"
            label="Ad"
            placeholder="Adınız"
            value={values.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={touched.firstName ? errors.firstName : undefined}
            required
            leftIcon={<UserCircle className="w-5 h-5" />}
            autoComplete="given-name"
            className="bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white"
            labelColor="dark"
          />
          <Input
            id="lastName"
            type="text"
            label="Soyad"
            placeholder="Soyadınız"
            value={values.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={touched.lastName ? errors.lastName : undefined}
            required
            autoComplete="family-name"
            className="bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white"
            labelColor="dark"
          />
        </div>

        <Input
          id="email"
          type="email"
          label="E-posta"
          placeholder="ornek@email.com"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={touched.email ? errors.email : undefined}
          required
          leftIcon={<Mail className="w-5 h-5" />}
          autoComplete="email"
          className="bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white"
          labelColor="dark"
        />

        <Input
          id="username"
          type="text"
          label="Kullanıcı Adı"
          placeholder="kullaniciadi"
          value={values.username}
          onChange={(e) => handleChange('username', e.target.value)}
          onBlur={() => handleBlur('username')}
          error={touched.username ? errors.username : undefined}
          required
          minLength={3}
          leftIcon={<User className="w-5 h-5" />}
          helperText={!touched.username || !errors.username ? "En az 3 karakter, sadece harf, rakam ve alt çizgi" : undefined}
          autoComplete="username"
          className="bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white"
          labelColor="dark"
        />

        <div>
          <Input
            id="password"
            type="password"
            label="Şifre"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            required
            minLength={6}
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="new-password"
            className="bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white"
            labelColor="dark"
          />
          {values.password && (
            <PasswordStrength password={values.password} />
          )}
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-white/30 rounded mt-1 bg-white/50 cursor-pointer"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-amber-100 cursor-pointer">
            <Link to="/terms" className="text-white hover:text-yellow-300 underline transition-colors">
              Kullanım şartlarını
            </Link>{' '}
            ve{' '}
            <Link to="/privacy" className="text-white hover:text-yellow-300 underline transition-colors">
              gizlilik politikasını
            </Link>{' '}
            kabul ediyorum
            {!termsAccepted && submitError && (
              <span className="text-red-300 ml-1">*</span>
            )}
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/50"
        >
          Kayıt Ol
        </Button>

        <div className="text-center pt-4 border-t border-white/20">
          <p className="text-sm text-amber-100">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/login"
              className="font-medium text-white hover:text-yellow-300 transition-colors underline decoration-2 underline-offset-2"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;

