import { taskService } from '@/services/task-service';
import { Task } from '@/types/Task';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export const useTodos = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Error al cargar las tareas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const createTask = async (taskData: any) => {
    setLoading(true);
    const newTask = await taskService.createTask(taskData);
    if (newTask) {
        await loadTasks();
        return true;
    }
    setLoading(false);
    return false;
  };

  const editTask = async (id: string, title: string, completed: boolean) => {
    setLoading(true);
    const taskData = {
        title,
        completed,
        location: { latitude: -33.4489, longitude: -70.6693 } 
    };

    const success = await taskService.updateTaskFull(id, taskData);
    if (success) {
        await loadTasks(); 
        return true;
    }
    setLoading(false);
    return false;
  };

  const toggleTaskStatus = async (id: string, currentStatus: boolean) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
    const success = await taskService.updateTaskStatus(id, !currentStatus);
    if (!success) setTasks(originalTasks);
  };

  const deleteTask = async (id: string) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));
    const success = await taskService.deleteTask(id);
    if (!success) setTasks(originalTasks);
  };

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    editTask,
    toggleTaskStatus,
    deleteTask
  };
};