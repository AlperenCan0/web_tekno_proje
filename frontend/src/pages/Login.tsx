import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/auth';
import { Input, Button } from '../components/ui';
import { Mail, Lock } from 'lucide-react';

/**
 * Login Page Component - Kullanıcı giriş sayfası
 * Modern split-screen tasarım ile yeniden tasarlandı
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Zaten giriş yapmışsa ana sayfaya yönlendir
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error toast is already shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Hoş Geldiniz"
      subtitle="Hesabınıza giriş yapın ve hikayelerinize devam edin"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="email"
            type="email"
            label="E-posta"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-5 h-5" />}
          />
          <Input
            id="password"
            type="password"
            label="Şifre"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-5 h-5" />}
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

