import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Task, TaskStatus } from '@/types';
import * as taskService from '@/services/taskService';

interface TasksContextValue {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTask: (title: string, description?: string, category?: string) => Promise<Task>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  updateTask: (
    id: string,
    updates: { title?: string; description?: string; status?: TaskStatus; category?: string }
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  addFocusedTime: (taskId: string, ms: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTasks(await taskService.getAllTasks());
    } catch (cause) {
      console.error('[TasksProvider] refresh', cause);
      setError('Não foi possível carregar suas tarefas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createTask = useCallback(async (title: string, description = '', category = '') => {
    const task = await taskService.createTask(title, description, category);
    setTasks((previous) => [task, ...previous]);
    setError(null);
    return task;
  }, []);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    await taskService.updateTaskStatus(id, status);
    setTasks((previous) => previous.map((task) =>
      task.id === id ? { ...task, status, updatedAt: Date.now() } : task
    ));
    setError(null);
  }, []);

  const updateTask = useCallback(async (
    id: string,
    updates: { title?: string; description?: string; status?: TaskStatus; category?: string }
  ) => {
    await taskService.updateTask(id, updates);
    setTasks((previous) => previous.map((task) =>
      task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
    ));
    setError(null);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setError(null);
  }, []);

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => tasks.filter((task) => task.status === status),
    [tasks]
  );

  const addFocusedTime = useCallback(async (taskId: string, ms: number) => {
    await taskService.addFocusedTime(taskId, ms);
    setTasks((previous) => previous.map((task) =>
      task.id === taskId
        ? { ...task, totalFocusedMs: task.totalFocusedMs + ms }
        : task
    ));
    setError(null);
  }, []);

  const value = useMemo<TasksContextValue>(() => ({
    tasks,
    loading,
    error,
    refresh,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getTasksByStatus,
    addFocusedTime,
  }), [
    tasks,
    loading,
    error,
    refresh,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getTasksByStatus,
    addFocusedTime,
  ]);

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within a TasksProvider.');
  return context;
}
