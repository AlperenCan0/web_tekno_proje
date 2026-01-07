import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthLayout } from '../components/auth';
import { Input, Button } from '../components/ui';
import { Mail, Lock, User, UserCircle } from 'lucide-react';

/**
 * Register Page Component - Kullanıcı kayıt sayfası
 * Yeni kullanıcı kaydı oluşturulur
 */
const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
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
      await register(email, username, password, firstName, lastName);
      navigate('/');
    } catch (error) {
      // Error toast is already shown in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Hesap Oluşturun"
      subtitle="Topluluğumuza katılın ve hikayelerinizi paylaşmaya başlayın"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="firstName"
            type="text"
            label="Ad"
            placeholder="Adınız"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            leftIcon={<UserCircle className="w-5 h-5" />}
          />
          <Input
            id="lastName"
            type="text"
            label="Soyad"
            placeholder="Soyadınız"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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
          id="username"
          type="text"
          label="Kullanıcı Adı"
          placeholder="kullaniciadi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
          leftIcon={<User className="w-5 h-5" />}
          helperText="En az 3 karakter olmalıdır"
        />

        <Input
          id="password"
          type="password"
          label="Şifre"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          leftIcon={<Lock className="w-5 h-5" />}
          helperText="En az 6 karakter olmalıdır"
        />

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            <Link to="/terms" className="text-blue-600 hover:text-blue-800">
              Kullanım şartlarını
            </Link>{' '}
            ve{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
              gizlilik politikasını
            </Link>{' '}
            kabul ediyorum
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Kayıt Ol
        </Button>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-800"
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

