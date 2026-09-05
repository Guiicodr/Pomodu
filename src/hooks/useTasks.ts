/**
 * useTasks.ts — Hook para gerenciar tarefas com persistência SQLite
 */

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '@/types';
import * as taskService from '@/services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await taskService.getAllTasks();
      setTasks(all);
    } catch (err) {
      console.error('[useTasks] refresh', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createTask = useCallback(
    async (title: string, description?: string, category?: string) => {
      const task = await taskService.createTask(title, description ?? '', category ?? '');
      setTasks((prev) => [task, ...prev]);
      return task;
    },
    []
  );

  const updateTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      await taskService.updateTaskStatus(id, status);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, updatedAt: Date.now() } : t
        )
      );
    },
    []
  );

  const updateTask = useCallback(
    async (
      id: string,
      updates: { title?: string; description?: string; status?: TaskStatus; category?: string }
    ) => {
      await taskService.updateTask(id, updates);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, ...updates, updatedAt: Date.now() }
            : t
        )
      );
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => tasks.filter((t) => t.status === status),
    [tasks]
  );

  const addFocusedTime = useCallback(
    async (taskId: string, ms: number) => {
      await taskService.addFocusedTime(taskId, ms);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, totalFocusedMs: t.totalFocusedMs + ms }
            : t
        )
      );
    },
    []
  );

  return {
    tasks,
    loading,
    refresh,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    getTasksByStatus,
    addFocusedTime,
  };
}