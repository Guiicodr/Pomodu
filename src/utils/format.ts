/**
 * Formata ms no formato mm:ss ou h:mm:ss
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Retorna o nome do dia da semana em português
 */
export function getWeekdayName(timestamp: number): string {
  const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  return days[new Date(timestamp).getDay()];
}

/**
 * Gera um ID simples baseado em timestamp + math.random
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}