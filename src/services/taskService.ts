/**
 * taskService.ts — CRUD de tarefas no SQLite (com categoria)
 */

import { getDatabase } from './database';
import { Task, TaskStatus } from '@/types';
import { generateId } from '@/utils/format';

interface TaskRow {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string | null;
  created_at: number;
  updated_at: number;
  total_focused_ms: number;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    category: row.category ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    totalFocusedMs: row.total_focused_ms,
    sessionIds: [],
  };
}

export async function getAllTasks(): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<TaskRow>(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  );
  return rows.map(rowToTask);
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<TaskRow>(
    'SELECT * FROM tasks WHERE status = ? ORDER BY updated_at DESC',
    status
  );
  return rows.map(rowToTask);
}

export async function createTask(
  title: string,
  description: string = '',
  category: string = ''
): Promise<Task> {
  const db = getDatabase();
  const now = Date.now();
  const id = generateId();

  await db.runAsync(
    `INSERT INTO tasks (id, title, description, status, category, created_at, updated_at, total_focused_ms)
     VALUES (?, ?, ?, 'todo', ?, ?, ?, 0)`,
    id, title, description, category, now, now
  );

  return {
    id, title, description, status: 'todo', category,
    createdAt: now, updatedAt: now, totalFocusedMs: 0, sessionIds: [],
  };
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?',
    status, Date.now(), id
  );
}

export async function updateTask(
  id: string,
  updates: { title?: string; description?: string; status?: TaskStatus; category?: string }
): Promise<void> {
  const db = getDatabase();
  const now = Date.now();
  const sets: string[] = ['updated_at = ?'];
  const params: (string | number)[] = [now];

  if (updates.title !== undefined) { sets.push('title = ?'); params.push(updates.title); }
  if (updates.description !== undefined) { sets.push('description = ?'); params.push(updates.description); }
  if (updates.status !== undefined) { sets.push('status = ?'); params.push(updates.status); }
  if (updates.category !== undefined) { sets.push('category = ?'); params.push(updates.category); }

  params.push(id);
  await db.runAsync(`UPDATE tasks SET ${sets.join(', ')} WHERE id = ?`, ...params);
}

export async function addFocusedTime(taskId: string, ms: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE tasks SET total_focused_ms = total_focused_ms + ?, updated_at = ? WHERE id = ?',
    ms, Date.now(), taskId
  );
}

export async function deleteTask(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}