import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{submitError}</p>
            </div>
          </div>
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
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Beni hatırla</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-800"
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
        >
          Giriş Yap
        </Button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-800"
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

