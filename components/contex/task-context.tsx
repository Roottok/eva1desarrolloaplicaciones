import { taskService } from '@/services/task-service';
import { Task } from '@/types/Task';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  toggleTask: (id: string, status: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    } else {
        setTasks([]);
    }
  }, [isAuthenticated]);

  const loadTasks = async () => {
    setLoading(true);
    const data = await taskService.getTasks();
    setTasks(data);
    setLoading(false);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = await taskService.createTask(taskData);
    if (newTask) setTasks([...tasks, newTask]);
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const updated = await taskService.updateTask(id, !currentStatus);
    if (updated) {
      setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !currentStatus } : t)));
    }
  };

  const deleteTask = async (id: string) => {
    const success = await taskService.deleteTask(id);
    if (success) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};