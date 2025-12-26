export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    location?: {
        latitude: number;
        longitude: number;
    };
    photoUri?: string;
    userId?: string;
    createdAt?: string;
}