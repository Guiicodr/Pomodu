/**
 * database.ts — SQLite local com migrações
 */

import * as SQLite from 'expo-sqlite';
import { generateId } from '@/utils/format';

let db: SQLite.SQLiteDatabase | null = null;
let initialization: Promise<SQLite.SQLiteDatabase> | null = null;

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  if (initialization) return initialization;

  initialization = (async () => {
    const database = await SQLite.openDatabaseAsync('pomodu.db');

    await database.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;

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

    await addColumnIfMissing(database, 'tasks', 'category', "ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT ''");
    await addColumnIfMissing(database, 'work_locations', 'icon', "ALTER TABLE work_locations ADD COLUMN icon TEXT DEFAULT 'home'");
    await database.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_tasks_status_updated_at ON tasks(status, updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_focus_sessions_completed_start_at ON focus_sessions(interrupted, start_at);
      CREATE INDEX IF NOT EXISTS idx_focus_sessions_location_completed ON focus_sessions(location_id, interrupted);
      CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_start_at ON focus_sessions(task_id, start_at);
    `);

    db = database;
    return database;
  })().catch((error: unknown) => {
    initialization = null;
    throw error;
  });

  return initialization;
}

async function addColumnIfMissing(
  database: SQLite.SQLiteDatabase,
  table: 'tasks' | 'work_locations',
  column: string,
  alterSql: string
): Promise<void> {
  const columns = await database.getAllAsync<{ name: string }>(`PRAGMA table_info(${table})`);
  if (!columns.some((item) => item.name === column)) {
    await database.execAsync(alterSql);
  }
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

export { generateId };