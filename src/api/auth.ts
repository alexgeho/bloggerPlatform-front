import { apiClient } from "./client";
import type { User } from "../types";

/**
 * Интерфейс для регистрации пользователя
 */
export interface RegistrationPayload {
  login: string;
  email: string;
  password: string;
}

/**
 * API для работы с авторизацией пользователей
 * Включает регистрацию, вход, выход и получение данных пользователя
 */
export const authApi = {
  /**
   * Регистрирует нового пользователя
   */
  async register(payload: RegistrationPayload): Promise<void> {
    await apiClient.post("/auth/registration", payload);
  },

  /**
   * Подтверждает регистрацию пользователя по коду
   */
  async confirmRegistration(code: string): Promise<void> {
    await apiClient.post("/auth/registration-confirmation", { code });
  },

  /**
   * Выполняет вход пользователя
   * @param payload - логин/email и пароль
   * @returns JWT токен для авторизации
   */
  async login(payload: { loginOrEmail: string; password: string }): Promise<{ accessToken?: string } | void> {
    const res = await apiClient.post("/auth/login", payload);
    return res.data;
  },

  /**
   * Выполняет выход пользователя
   */
  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  /**
   * Получает данные текущего авторизованного пользователя
   * @returns Данные пользователя
   */
  async me<T = User>(): Promise<T> {
    const res = await apiClient.get<T>("/auth/me");
    return res.data;
  },
};


