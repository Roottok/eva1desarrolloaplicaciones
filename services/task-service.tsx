import { Task } from '@/types/Task';
import api from './api';

export const taskService = {

    async getTasks(): Promise<Task[]> {
        try {
            const response = await api.get('/todos');
            if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            return [];
        }
    },

    async createTask(task: any): Promise<Task | null> {
        try {
            const response = await api.post('/todos', task);
            return response.data.data || response.data;
        } catch (error) {
            return null;
        }
    },

    async updateTaskFull(id: string, taskData: any): Promise<boolean> {
        try {
            await api.put(`/todos/${id}`, taskData);
            return true;
        } catch (error) {
            console.error("Error updating task:", error);
            return false;
        }
    },

    async updateTaskStatus(id: string, completed: boolean): Promise<boolean> {
        try {
            await api.patch(`/todos/${id}`, { completed });
            return true;
        } catch (error) {
            return false;
        }
    },

    async deleteTask(id: string): Promise<boolean> {
        try {
            await api.delete(`/todos/${id}`);
            return true;
        } catch (error) {
            return false;
        }
    }
};