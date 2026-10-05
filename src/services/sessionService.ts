/**
 * sessionService.ts — CRUD de sessoes + metricas + streak
 */
import { getDatabase } from './database';
import { FocusSession } from '@/types';
import { generateId } from '@/utils/format';

interface Row { id: string; task_id: string | null; start_at: number; end_at: number; duration_ms: number; actual_ms: number; location_id: string | null; interrupted: number; }

function toS(r: Row): FocusSession { return { id: r.id, taskId: r.task_id, startAt: r.start_at, endAt: r.end_at, durationMs: r.duration_ms, actualMs: r.actual_ms, locationId: r.location_id, interrupted: r.interrupted === 1 }; }

export async function createSession(s: Omit<FocusSession, 'id'>): Promise<FocusSession> {
  const db = getDatabase(); const id = generateId();
  await db.runAsync('INSERT INTO focus_sessions (id,task_id,start_at,end_at,duration_ms,actual_ms,location_id,interrupted) VALUES(?,?,?,?,?,?,?,?)', id, s.taskId, s.startAt, s.endAt, s.durationMs, s.actualMs, s.locationId, s.interrupted ? 1 : 0);
  return { id, ...s };
}

export async function getAllSessions(): Promise<FocusSession[]> {
  const db = getDatabase(); const rows = await db.getAllAsync<Row>('SELECT * FROM focus_sessions ORDER BY start_at DESC'); return rows.map(toS);
}

export async function getTotalFocusedMs(): Promise<number> {
  const db = getDatabase(); const r = await db.getFirstAsync<{ total: number | null }>('SELECT COALESCE(SUM(actual_ms),0) AS total FROM focus_sessions WHERE interrupted=0'); return r?.total ?? 0;
}

export async function getTodaySessionCount(): Promise<number> {
  const db = getDatabase(); const today = new Date(); today.setHours(0, 0, 0, 0);
  const r = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM focus_sessions WHERE start_at>=? AND interrupted=0', today.getTime()); return r?.count ?? 0;
}

export async function calculateStreak(): Promise<number> {
  const db = getDatabase();
  const rows = await db.getAllAsync<{ day: string }>("SELECT DISTINCT date(start_at/1000,'unixepoch','localtime') AS day FROM focus_sessions WHERE interrupted=0 ORDER BY day DESC");
  if (!rows.length) return 0;
  let streak = 1; const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = new Date(rows[0].day + 'T00:00:00');
  if (Math.round((today.getTime() - first.getTime()) / 86400000) > 1) return 0;
  for (let i = 1; i < rows.length; i++) {
    const prev = new Date(rows[i - 1].day + 'T00:00:00'), cur = new Date(rows[i].day + 'T00:00:00');
    if (Math.round((prev.getTime() - cur.getTime()) / 86400000) === 1) streak++; else break;
  }
  return streak;
}

export async function getFocusedMsByWeekday(): Promise<number[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<{ weekday: number; total: number }>("SELECT (start_at/86400000+4)%7 AS weekday,COALESCE(SUM(actual_ms),0) AS total FROM focus_sessions WHERE interrupted=0 GROUP BY weekday ORDER BY weekday");
  const r = new Array(7).fill(0); for (const row of rows) r[row.weekday] = row.total; return r;
}

export async function getFocusedMsByLocation(): Promise<{ locationId: string; name: string; totalMs: number; sessions: number }[]> {
  const db = getDatabase(); return await db.getAllAsync("SELECT fs.location_id AS locationId,wl.name,COALESCE(SUM(fs.actual_ms),0) AS totalMs,COUNT(fs.id) AS sessions FROM focus_sessions fs LEFT JOIN work_locations wl ON fs.location_id=wl.id WHERE fs.interrupted=0 AND fs.location_id IS NOT NULL GROUP BY fs.location_id ORDER BY totalMs DESC");
}