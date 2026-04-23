import { describe, expect, it } from 'vitest';
import {
  buildLetterFilename,
} from './fileDownload';
import {
  formatDateFileSafe,
  formatDateLong,
  formatDateShort,
  monthsBetween,
  parseISODate,
} from './formatDate';

describe('formatDate', () => {
  it('parseISODate parses valid YYYY-MM-DD', () => {
    const d = parseISODate('2025-12-02');
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2025);
    expect(d?.getMonth()).toBe(11);
    expect(d?.getDate()).toBe(2);
  });

  it('parseISODate returns null for empty or invalid input', () => {
    expect(parseISODate('')).toBeNull();
    expect(parseISODate('not-a-date')).toBeNull();
  });

  it('formatDateLong returns Spanish long format', () => {
    expect(formatDateLong('2025-12-02')).toBe('2 de diciembre de 2025');
  });

  it('formatDateLong returns empty for invalid', () => {
    expect(formatDateLong('')).toBe('');
  });

  it('formatDateShort returns dd/mm/yyyy', () => {
    expect(formatDateShort('2025-06-03')).toBe('03/06/2025');
  });

  it('formatDateFileSafe returns YYYYMMDD', () => {
    expect(formatDateFileSafe('2025-12-02')).toBe('20251202');
  });

  it('monthsBetween computes month delta', () => {
    expect(monthsBetween('2025-06-03', '2025-12-02')).toBe(6);
  });
});

describe('buildLetterFilename', () => {
  it('builds safe filename with ext', () => {
    const name = buildLetterFilename('Isabela Zapata', '20251202', 'pdf');
    expect(name).toBe('Carta_Isabela_Zapata_20251202.pdf');
  });

  it('falls back to placeholders when inputs empty', () => {
    expect(buildLetterFilename('', '', 'docx')).toBe('Carta_aprendiz_fecha.docx');
  });

  it('strips non-word characters from name', () => {
    expect(buildLetterFilename('María José/Pérez', '20250101', 'pdf')).toBe(
      'Carta_MaraJosPrez_20250101.pdf'
    );
  });
});
