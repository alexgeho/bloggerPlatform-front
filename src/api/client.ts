import axios from "axios";

/**
 * Основной HTTP клиент для API запросов
 * Настроен для работы с JWT токенами авторизации
 */
export const apiClient = axios.create({
  baseURL: "https://blogger-platform-pi.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Интерцептор для автоматической установки JWT токена в каждый запрос
 * Добавляет Authorization header с Bearer токеном из localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.method?.toUpperCase(), config.url);
      console.log('Full Authorization header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Интерцептор для обработки ответов сервера
 * Обрабатывает ошибки 401 (Unauthorized) и логирует проблемы с токеном
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - token might be expired or invalid');
      console.log('Current token:', localStorage.getItem('accessToken'));
      // Можно автоматически очистить токен при 401
      // localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

/**
 * Устанавливает или удаляет JWT токен в localStorage
 * @param token - JWT токен для сохранения, или undefined для удаления
 */
export function setAuthToken(token?: string) {
  if (token) {
    localStorage.setItem('accessToken', token);
    console.log('Auth token set:', `Bearer ${token.substring(0, 20)}...`);
  } else {
    localStorage.removeItem('accessToken');
    console.log('Auth token removed');
  }
}


