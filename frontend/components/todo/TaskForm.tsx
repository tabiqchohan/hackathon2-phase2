'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { apiClient } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
  token: string | null;
}

export default function TaskForm({ onTaskCreated, token }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !token) return;

    try {
      setLoading(true);
      setError(null);

      const newTask = await apiClient.createTask(token, title, description);
      onTaskCreated(newTask);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Task</h3>
      </Card.Header>
      <Card.Body>
        <div className="mt-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="What needs to be done?"
                label="Title *"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Add details..."
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                loading={loading}
                disabled={!title.trim()}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </Button>
              {error && (
                <div className="text-sm text-red-600 ml-2">{error}</div>
              )}
            </div>
          </form>
        </div>
      </Card.Body>
    </Card>
  );
}