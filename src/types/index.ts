/** Status de uma tarefa no Kanban */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: string;
  createdAt: number;
  updatedAt: number;
  sessionIds: string[];
  totalFocusedMs: number;
}

export interface FocusSession {
  id: string;
  taskId: string | null;
  startAt: number;
  endAt: number;
  durationMs: number;
  actualMs: number;
  locationId: string | null;
  interrupted: boolean;
}

export type LocationIcon = 'home' | 'briefcase' | 'coffee' | 'university' | 'gym' | 'other';

export interface WorkLocation {
  id: string;
  name: string;
  icon: LocationIcon;
  latitude: number;
  longitude: number;
  createdAt: number;
  totalSessions: number;
  totalFocusedMs: number;
}

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
};