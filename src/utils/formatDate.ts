const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function parseISODate(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function formatDateLong(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return '';
  const day = String(d.getDate()).padStart(2, '0');
  return `${day} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatDateShort(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function formatDateFileSafe(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}${mm}${dd}`;
}

export function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function parseDurationToMonths(duration: string): number {
  const d = duration.toLowerCase();
  
  if (d.includes('año') || d.includes('ano')) {
    if (d.includes('un ') || d.includes(' 1 ') || d === '1 año' || d === 'un año') return 12;
    if (d.includes('dos ') || d.includes(' 2 ') || d === '2 años' || d === 'dos años') return 24;
    return 12;
  }

  const wordToNum: Record<string, number> = {
    'un': 1, 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5,
    'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
    'once': 11, 'doce': 12
  };
  
  const matchNum = d.match(/\d+/);
  if (matchNum) {
    return parseInt(matchNum[0], 10);
  }

  for (const [word, num] of Object.entries(wordToNum)) {
    if (d.includes(word)) return num;
  }

  return 6;
}

export function calculateStartDateISO(endDateISO: string, months: number): string {
  const end = parseISODate(endDateISO);
  if (!end) return '';
  end.setMonth(end.getMonth() - months);
  const mm = String(end.getMonth() + 1).padStart(2, '0');
  const dd = String(end.getDate()).padStart(2, '0');
  return `${end.getFullYear()}-${mm}-${dd}`;
}

export function sixMonthsAgoISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 6);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function monthsBetween(startISO: string, endISO: string): number {
  const a = parseISODate(startISO);
  const b = parseISODate(endISO);
  if (!a || !b) return 0;
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}
