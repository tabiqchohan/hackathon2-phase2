import { useState } from 'react';
import TaskItem from '@/components/todo/TaskItem';
import { Task } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TaskListProps {
  tasks: Task[];
  token: string | null;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export default function TaskList({ tasks, token, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Your Tasks</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your todo items</p>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {filteredTasks.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                token={token}
                onTaskUpdated={onTaskUpdated}
                onTaskDeleted={onTaskDeleted}
              />
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}