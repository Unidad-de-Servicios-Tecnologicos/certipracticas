import type { Project } from '@/types/activities';

export function parseProjectFromString(raw: string): Project {
  const match = raw.match(/^(P\d{4}-\d{6}-\d{5})\s*[–—-]\s*([^:]+):\s*(.+)$/s);
  if (match) return { code: match[1].trim(), name: match[2].trim(), description: match[3].trim() };
  const colonMatch = raw.match(/^([^:]+):\s*(.+)$/s);
  if (colonMatch) return { code: '', name: colonMatch[1].trim(), description: colonMatch[2].trim() };
  return { code: '', name: '', description: raw };
}
