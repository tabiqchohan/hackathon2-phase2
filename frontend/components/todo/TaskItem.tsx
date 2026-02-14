import { useState } from 'react';
import { Task } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface TaskItemProps {
  task: Task;
  token: string | null;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskItem({ task, token, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleComplete = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const updatedTask = await apiClient.updateTask(token, task.id, {
        ...task,
        completed: !task.completed,
      });
      onTaskUpdated(updatedTask);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setLoading(true);
      await apiClient.deleteTask(token, task.id);
      onTaskDeleted(task.id);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const updatedTask = await apiClient.updateTask(token, task.id, {
        title: editTitle,
        description: editDescription,
      });
      onTaskUpdated(updatedTask);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={loading}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <div className="ml-3 min-w-0">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={2}
                />
              </>
            ) : (
              <>
                <p
                  className={`text-sm font-medium text-gray-900 ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-sm text-gray-500 ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="inline-flex items-center px-2.5 py-0.5 rounded border border-transparent text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                  setEditDescription(task.description || '');
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded border border-transparent text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-2.5 py-0.5 rounded border border-transparent text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center px-2.5 py-0.5 rounded border border-transparent text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </li>
  );
}