// frontend/lib/api.ts

import { Task, AuthResponse } from '@/lib/types';

// Backend URL points directly to your Hugging Face deployed backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://tabiqchohan-hackathon2-phase2.hf.space/api/v1';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // --------------------------
  // Authentication
  // --------------------------
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  }

  async logout(token: string): Promise<void> {
    await fetch(`${this.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // --------------------------
  // Todo Tasks
  // --------------------------
  async getTasks(token: string): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/todos`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch tasks' }));
      throw new Error(errorData.message || 'Failed to fetch tasks');
    }

    return response.json();
  }

  async createTask(token: string, title: string, description?: string): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/todos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create task' }));
      throw new Error(errorData.message || 'Failed to create task');
    }

    return response.json();
  }

  async updateTask(token: string, taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/todos/${taskId}`, {
      method: 'PATCH', // partial updates
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update task' }));
      throw new Error(errorData.message || 'Failed to update task');
    }

    return response.json();
  }

  async deleteTask(token: string, taskId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/todos/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete task' }));
      throw new Error(errorData.message || 'Failed to delete task');
    }
  }
}

export const apiClient = new ApiClient();