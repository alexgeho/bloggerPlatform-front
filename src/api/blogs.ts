import { apiClient } from "./client";
import axios from "axios";
import type { Blog, BlogInput, ApiResponse, Post } from "../types";

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
 * API для работы с блогами
 * Включает CRUD операции для блогов и получение постов блога
 * Административные операции используют Basic Auth
 */
export const blogsApi = {
  /**
   * Получает список всех блогов с пагинацией
   * @param page - номер страницы (по умолчанию 1)
   * @param pageSize - размер страницы (по умолчанию 10)
   * @returns Список блогов с метаданными пагинации
   */
  async getBlogs<T = Blog>(page: number = 1, pageSize: number = 10): Promise<ApiResponse<T>> {
    const res = await apiClient.get<ApiResponse<T>>("/blogs", {
      params: {
        pageNumber: page,
        pageSize: pageSize
      }
    });
    return res.data;
  },

  /**
   * Получает посты конкретного блога с пагинацией
   * @param blogId - ID блога
   * @param page - номер страницы (по умолчанию 1)
   * @param pageSize - размер страницы (по умолчанию 10)
   * @returns Список постов блога с метаданными пагинации
   */
  async getPostsByBlogId<T = Post>(blogId: string, page: number = 1, pageSize: number = 10): Promise<ApiResponse<T>> {
    const res = await apiClient.get<ApiResponse<T>>(`/blogs/${blogId}/posts`, {
      params: {
        pageNumber: page,
        pageSize: pageSize
      }
    });
    return res.data;
  },

  /**
   * Получает данные конкретного блога по ID
   * @param blogId - ID блога
   * @returns Данные блога
   */
  async getBlog<T = Blog>(blogId: string): Promise<T> {
    const res = await apiClient.get<T>(`/blogs/${blogId}`);
    return res.data;
  },

  /**
   * Создает новый блог (только для админа)
   * @param payload - данные для создания блога
   * @returns Созданный блог
   */
  async createBlog<T = Blog>(payload: BlogInput): Promise<T> {
    const res = await adminApiClient.post<T>(`/blogs`, payload, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
    return res.data;
  },

  /**
   * Обновляет существующий блог (только для админа)
   * @param blogId - ID блога для обновления
   * @param payload - новые данные блога
   * @returns Обновленный блог
   */
  async updateBlog<T = Blog>(blogId: string, payload: BlogInput): Promise<T> {
    const res = await adminApiClient.put<T>(`/blogs/${blogId}`, payload, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
    return res.data;
  },

  /**
   * Удаляет блог (только для админа)
   * @param blogId - ID блога для удаления
   */
  async deleteBlog(blogId: string): Promise<void> {
    await adminApiClient.delete(`/blogs/${blogId}`, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
  },
};


