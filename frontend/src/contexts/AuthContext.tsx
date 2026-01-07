import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Auth Context - Kullanıcı kimlik doğrulama ve yetkilendirme state yönetimi
 * JWT token yönetimi, login/logout işlemleri ve kullanıcı bilgilerini sağlar
 */

interface User {
  id: string;
  username: string;
  email: string;
  role: 'User' | 'Admin' | 'SuperAdmin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios instance - API istekleri için
const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request interceptor - Her istekte token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorage'dan token ve kullanıcı bilgilerini yükle
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Kullanıcı girişi yapar
   * JWT token alır ve localStorage'a kaydeder
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, userId, username, role } = response.data;

      const userData: User = { id: userId, username, email, role };
      
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Giriş başarılı!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Giriş başarısız');
      throw error;
    }
  };

  /**
   * Yeni kullanıcı kaydı oluşturur
   * JWT token alır ve localStorage'a kaydeder
   */
  const register = async (
    email: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        firstName,
        lastName,
      });
      const { accessToken, userId, username: registeredUsername, role } = response.data;

      const userData: User = { id: userId, username: registeredUsername, email, role };
      
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success('Kayıt başarılı!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Kayıt başarısız');
      throw error;
    }
  };

  /**
   * Kullanıcı çıkışı yapar
   * Token ve kullanıcı bilgilerini temizler
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Çıkış yapıldı');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'Admin' || user?.role === 'SuperAdmin',
    isSuperAdmin: user?.role === 'SuperAdmin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Auth context hook
 * Kullanıcı bilgileri ve auth işlemlerine erişim sağlar
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API instance'ı export et
export { api };

