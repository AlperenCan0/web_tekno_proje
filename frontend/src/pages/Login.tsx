import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/auth';
import { Input, Button } from '../components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';

/**
 * Login Page Component - Kullanıcı giriş sayfası
 * Modern split-screen tasarım ile yeniden tasarlandı
 */
const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: validationRules.email,
      password: validationRules.required,
    },
  );

  // Zaten giriş yapmışsa ana sayfaya yönlendir
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

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Giriş başarısız. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Hoş Geldiniz"
      subtitle="Hesabınıza giriş yapın ve hikayelerinize devam edin"
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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

        <div className="space-y-4">
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
            id="password"
            type="password"
            label="Şifre"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={touched.password ? errors.password : undefined}
            required
            leftIcon={<Lock className="w-5 h-5" />}
            autoComplete="current-password"
            className="bg-white/90 backdrop-blur-sm border-white/30 focus:bg-white"
            labelColor="dark"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-white/30 rounded bg-white/50"
            />
            <span className="ml-2 text-sm text-amber-100 group-hover:text-white transition-colors">Beni hatırla</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-amber-200 hover:text-white transition-colors font-medium"
          >
            Şifremi unuttum
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-500/50"
        >
          Giriş Yap
        </Button>

        <div className="text-center pt-4 border-t border-white/20">
          <p className="text-sm text-amber-100">
            Hesabınız yok mu?{' '}
            <Link
              to="/register"
              className="font-medium text-white hover:text-yellow-300 transition-colors underline decoration-2 underline-offset-2"
            >
              Kayıt olun
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

