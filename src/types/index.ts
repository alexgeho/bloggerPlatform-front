/**
 * Основные типы для блогов
 * Определяют структуру данных блогов в приложении
 */
export interface Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface BlogSummary {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export interface BlogInput {
  name: string;
  description: string;
  websiteUrl: string;
}

/**
 * Основные типы для постов
 * Определяют структуру данных постов в приложении
 */
export interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  excerpt?: string;
  createdAt: string;
}

export interface PostInput {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

/**
 * Основные типы для комментариев
 * Определяют структуру данных комментариев в приложении
 */
export interface Comment {
  id: string;
  content: string;
  commentatorInfo?: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
}

export interface CommentInput {
  content: string;
}

// Основные типы для пользователей
export interface User {
  id: string;
  login: string;
  email: string;
  role?: UserRole;
}

export interface UserInput {
  login: string;
  email: string;
  password: string;
}

/**
 * Типы для авторизации
 * Определяют роли пользователей и контекст авторизации
 */
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  canCreateBlog: () => boolean;
  canCreatePost: () => boolean;
}

// Типы для API ответов
export interface ApiResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  pagesCount: number;
}

// Типы для форм
export interface LoginFormData {
  loginOrEmail: string;
  password: string;
}

export interface RegistrationFormData {
  login: string;
  email: string;
  password: string;
}
