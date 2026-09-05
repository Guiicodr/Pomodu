/**
 * database.ts — SQLite local com migrações
 */

import * as SQLite from 'expo-sqlite';
import { generateId } from '@/utils/format';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('pomodu.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo','in_progress','done')),
      category TEXT DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      total_focused_ms INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY NOT NULL,
      task_id TEXT,
      start_at INTEGER NOT NULL,
      end_at INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      actual_ms INTEGER NOT NULL,
      location_id TEXT,
      interrupted INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
    );
    CREATE TABLE IF NOT EXISTS work_locations (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT 'home',
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      created_at INTEGER NOT NULL,
      total_sessions INTEGER NOT NULL DEFAULT 0,
      total_focused_ms INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Migrações de colunas novas (idempotentes)
  const safeAlter = async (sql: string) => {
    try { await db!.execAsync(sql); } catch { /* já existe */ }
  };
  await safeAlter('ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT ""');
  await safeAlter('ALTER TABLE work_locations ADD COLUMN icon TEXT DEFAULT "home"');

  return db;
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

export { generateId };