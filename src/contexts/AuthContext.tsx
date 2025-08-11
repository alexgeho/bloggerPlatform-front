import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { setAuthToken } from '../api';
import { UserRole } from '../types';
import type { User, AuthContextType } from '../types';
import { decodeJWT } from '../utils/jwt';

// Создаем контекст для авторизации
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Провайдер контекста авторизации
 * Управляет состоянием пользователя, проверкой JWT токена и функциями входа/выхода
 * Предоставляет функции для проверки прав доступа (isAdmin, hasRole)
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Проверяет авторизацию пользователя при загрузке приложения
   * Декодирует JWT токен из localStorage и устанавливает данные пользователя
   */
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Checking auth with token:', token ? 'exists' : 'not found');
      
      if (token) {
        setAuthToken(token);
        
        // Декодируем JWT токен для получения данных пользователя
        const decoded = decodeJWT(token);
        console.log('Decoded JWT:', decoded);
        
        if (decoded && typeof decoded.userId === 'string' && typeof decoded.userLogin === 'string') {
          const userData: User = {
            id: decoded.userId,
            login: decoded.userLogin,
            email: typeof decoded.userEmail === 'string' ? decoded.userEmail : '',
            role: decoded.userRole === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER,
          };
          console.log('User data from JWT:', userData);
          setUser(userData);
        } else {
          console.error('Invalid JWT structure');
          localStorage.removeItem('accessToken');
          setAuthToken();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      setAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Функция входа пользователя
   * Сохраняет JWT токен и обновляет состояние пользователя
   */
  const login = async (token: string) => {
    console.log('Login called with token:', token ? 'exists' : 'not found');
    setAuthToken(token);
    await checkAuth();
  };

  /**
   * Функция выхода пользователя
   * Очищает токен и сбрасывает состояние пользователя
   */
  const logout = () => {
    console.log('Logout called');
    setAuthToken();
    setUser(null);
  };

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Проверяет, имеет ли пользователь указанную роль
   * @param role - роль для проверки (USER или ADMIN)
   * @returns true если пользователь имеет указанную роль
   */
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  /**
   * Проверяет, является ли пользователь администратором
   * @returns true если логин пользователя равен 'admin'
   */
  const isAdmin = (): boolean => {
    return user?.login === 'admin';
  };

  const canCreateBlog = (): boolean => {
    return isAdmin();
  };

  const canCreatePost = (): boolean => {
    return isAdmin();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
    canCreateBlog,
    canCreatePost,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста авторизации
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
