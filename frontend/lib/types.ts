export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}