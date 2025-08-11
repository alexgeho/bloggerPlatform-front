import { apiClient } from "./client";
import axios from "axios";
import type { User, UserInput, ApiResponse } from "../types";

/**
 * Создаем отдельный клиент для Basic Auth (административные операции)
 */
const adminApiClient = axios.create({
  baseURL: "https://blogger-platform-pi.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Функция для создания Basic Auth заголовка
 * Использует хардкодированные учетные данные админа
 */
function createBasicAuthHeader() {
  const username = 'admin';
  const password = 'qwerty';
  const credentials = btoa(`${username}:${password}`);
  return `Basic ${credentials}`;
}

/**
 * API для работы с пользователями (только для админа)
 * Включает создание, удаление и управление ролями пользователей
 */
export const usersApi = {
  /**
   * Получает список всех пользователей с пагинацией (только для админа)
   * @returns Список пользователей с метаданными пагинации
   */
  async getUsers<T = User>(): Promise<ApiResponse<T>> {
    const res = await apiClient.get<ApiResponse<T>>("/users");
    return res.data;
  },

  /**
   * Создает нового пользователя (только для админа)
   * @param payload - данные для создания пользователя
   * @returns Созданный пользователь
   */
  async createUser<T = User>(payload: UserInput): Promise<T> {
    const res = await adminApiClient.post<T>(`/users`, payload, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
    return res.data;
  },

  /**
   * Удаляет пользователя (только для админа)
   * @param userId - ID пользователя для удаления
   */
  async deleteUser(userId: string): Promise<void> {
    await adminApiClient.delete(`/users/${userId}`, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
  },

  /**
   * Обновляет роль пользователя (только для админа)
   * @param userId - ID пользователя
   * @param role - новая роль
   * @returns Обновленный пользователь
   */
  async updateUserRole<T = User>(userId: string, role: string): Promise<T> {
    const res = await adminApiClient.put<T>(`/users/${userId}/role`, { role }, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
    return res.data;
  },
};
