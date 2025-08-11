import { blogsApi } from "./blogs";
import { apiClient as clientApi } from "./client";
import { authApi } from "./auth";
import { postsApi } from "./posts";
import { usersApi } from "./users";


export const API = {
    blog: blogsApi,        // API для работы с блогами 
    client: clientApi,     // Базовый HTTP клиент с авторизацией
    auth: authApi,         // API для авторизации (регистрация, вход, выход)
    post: postsApi,        // API для работы с постами и комментариями
    user: usersApi,        // API для управления пользователями
}

export { apiClient, setAuthToken } from "./client";
