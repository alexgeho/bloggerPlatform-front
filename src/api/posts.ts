import { apiClient } from "./client";
import axios from "axios";
import type { Post, PostInput, Comment, CommentInput, ApiResponse } from "../types";

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
 * API для работы с постами и комментариями
 * Включает CRUD операции для постов и комментариев
 * Административные операции используют Basic Auth
 */
export const postsApi = {
  /**
   * Получает список всех постов с пагинацией
   * @returns Список постов с метаданными пагинации
   */
  async getPosts<T = Post>(): Promise<ApiResponse<T>> {
    const res = await apiClient.get<ApiResponse<T>>("/posts");
    return res.data;
  },

  /**
   * Получает данные конкретного поста по ID
   * @param postId - ID поста
   * @returns Данные поста
   */
  async getPost<T = Post>(postId: string): Promise<T> {
    const res = await apiClient.get<T>(`/posts/${postId}`);
    return res.data;
  },

  /**
   * Создает новый пост в блоге (только для админа)
   * @param blogId - ID блога
   * @param payload - данные для создания поста
   * @returns Созданный пост
   */
  async createPost<T = Post>(blogId: string, payload: PostInput): Promise<T> {
    const res = await adminApiClient.post<T>(`/blogs/${blogId}/posts`, payload, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
    return res.data;
  },

  /**
   * Обновляет существующий пост (только для админа)
   * @param postId - ID поста для обновления
   * @param payload - новые данные поста
   * @returns Обновленный пост
   */
  async updatePost<T = Post>(postId: string, payload: PostInput): Promise<T> {
    const res = await adminApiClient.put<T>(`/posts/${postId}`, payload, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
    return res.data;
  },

  /**
   * Удаляет пост (только для админа)
   * @param postId - ID поста для удаления
   */
  async deletePost(postId: string): Promise<void> {
    await adminApiClient.delete(`/posts/${postId}`, {
      headers: {
        Authorization: createBasicAuthHeader()
      }
    });
  },

  /**
   * Получает комментарии к посту
   * @param postId - ID поста
   * @returns Список комментариев
   */
  async getComments<T = Comment>(postId: string): Promise<T[]> {
    const res = await apiClient.get<{ items: T[] }>(`/posts/${postId}/comments`);
    return res.data.items;
  },

  /**
   * Добавляет комментарий к посту (требует авторизации)
   * @param postId - ID поста
   * @param payload - данные комментария
   * @returns Созданный комментарий
   */
  async addComment<T = Comment>(postId: string, payload: CommentInput): Promise<T> {
    const res = await apiClient.post<T>(`/posts/${postId}/comments`, payload);
    return res.data;
  },

  /**
   * Обновляет комментарий
   * @param commentId - ID комментария
   * @param payload - новые данные комментария
   * @returns Обновленный комментарий
   */
  async updateComment<T = Comment>(commentId: string, payload: CommentInput): Promise<T> {
    const res = await apiClient.put<T>(`/comments/${commentId}`, payload);
    return res.data;
  },

  /**
   * Удаляет комментарий
   * @param commentId - ID комментария для удаления
   */
  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`);
  },
};


