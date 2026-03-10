import type { Task } from '../App';

export const STORAGE_KEY = 'todo_tasks_v2';

export function loadTasks(): Task[] {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) return [];
    
    const parsed = JSON.parse(savedTasks);
    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      dueDate: new Date(t.dueDate), // Always convert to Date, no optional check
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
}

export function clearAllTasks(): void {
  localStorage.removeItem(STORAGE_KEY);
  // Also clear old storage key if exists
  localStorage.removeItem('tasks');
}