/**
 * locationService.ts — GPS, reverse geocode, session location resolver
 */

import * as Location from 'expo-location';
import { getDatabase } from './database';
import { WorkLocation, LocationIcon } from '@/types';
import { generateId } from '@/utils/format';

interface Row { id: string; name: string; icon: string | null; latitude: number; longitude: number; created_at: number; total_sessions: number; total_focused_ms: number; }

function toLoc(r: Row): WorkLocation {
  return { id: r.id, name: r.name, icon: (r.icon as LocationIcon) ?? 'home', latitude: r.latitude, longitude: r.longitude, createdAt: r.created_at, totalSessions: r.total_sessions, totalFocusedMs: r.total_focused_ms };
}

export async function requestPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
  } catch { return null; }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const g = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (g.length > 0) {
      const p = [g[0].street, g[0].district, g[0].city, g[0].region].filter(Boolean) as string[];
      return p.slice(0, 2).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  } catch {}
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/** Resolve session location: capture GPS, find existing or create */
export async function resolveSessionLocation(): Promise<{ locationId: string | null; name: string | null }> {
  try {
    const c = await getCurrentPosition();
    if (!c) return { locationId: null, name: null };
    const existing = await findByCoords(c.latitude, c.longitude);
    if (existing) return { locationId: existing.id, name: existing.name };
    const name = await reverseGeocode(c.latitude, c.longitude);
    const loc = await create(name, c.latitude, c.longitude, inferIcon(name));
    return { locationId: loc.id, name: loc.name };
  } catch { return { locationId: null, name: null }; }
}

function inferIcon(n: string): LocationIcon {
  const s = n.toLowerCase();
  if (s.includes('casa') || s.includes('home') || s.includes('apart')) return 'home';
  if (s.includes('trabalho') || s.includes('office') || s.includes('escritorio')) return 'briefcase';
  if (s.includes('cafe') || s.includes('coffee')) return 'coffee';
  if (s.includes('biblioteca') || s.includes('library') || s.includes('universidade') || s.includes('faculdade')) return 'university';
  if (s.includes('gym') || s.includes('academia')) return 'gym';
  return 'other';
}

export async function create(name: string, lat: number, lng: number, icon: LocationIcon = 'home'): Promise<WorkLocation> {
  const db = getDatabase(); const id = generateId(); const now = Date.now();
  await db.runAsync('INSERT INTO work_locations (id,name,icon,latitude,longitude,created_at,total_sessions,total_focused_ms) VALUES (?,?,?,?,?,?,0,0)', id, name, icon, lat, lng, now);
  return { id, name, icon, latitude: lat, longitude: lng, createdAt: now, totalSessions: 0, totalFocusedMs: 0 };
}

export async function getAll(): Promise<WorkLocation[]> {
  const db = getDatabase();
  const rows = await db.getAllAsync<Row>('SELECT * FROM work_locations ORDER BY total_focused_ms DESC');
  return rows.map(toLoc);
}

export async function incrementMetrics(locationId: string, ms: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('UPDATE work_locations SET total_sessions = total_sessions + 1, total_focused_ms = total_focused_ms + ? WHERE id = ?', ms, locationId);
}

export async function remove(id: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM work_locations WHERE id = ?', id);
}

export async function findByCoords(lat: number, lng: number, tol: number = 0.005): Promise<WorkLocation | null> {
  const db = getDatabase();
  const row = await db.getFirstAsync<Row>('SELECT * FROM work_locations WHERE ABS(latitude - ?) < ? AND ABS(longitude - ?) < ? LIMIT 1', lat, tol, lng, tol);
  return row ? toLoc(row) : null;
}