'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import TaskList from '@/components/todo/TaskList';
import TaskForm from '@/components/todo/TaskForm';
import { Task } from '@/lib/types';
import { apiClient } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const tasksData = await apiClient.getTasks(token);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        if (err instanceof Error && err.message.includes('Unauthorized')) {
          logout();
          return;
        }
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token, logout]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Redirecting...</h1>
          <p className="mt-2 text-gray-600">You need to be logged in</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" centered={true} label="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Todo Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <TaskForm onTaskCreated={handleTaskCreated} token={token} />
          </div>
          <div>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            <TaskList
              tasks={tasks}
              token={token}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          </div>
        </div>
      </main>
    </div>
  );
}