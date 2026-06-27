import { describe, expect, it } from 'vitest';
import {
  buildBodyParagraph,
  buildClosing,
  buildDrafterLine,
  buildFooterLine,
  buildInstructorLine,
  buildStrengthsIntro,
  buildSubtitle,
  buildTitle,
} from './letterFormatter';
import { sampleLetter } from '@/data/defaultLetter';
import { formatDateLong } from '@/utils/formatDate';

describe('letterFormatter', () => {
  it('title includes center name uppercased', () => {
    expect(buildTitle(sampleLetter)).toContain(sampleLetter.center.name.toUpperCase());
  });

  it('subtitle includes signer position and regional', () => {
    const s = buildSubtitle(sampleLetter);
    expect(s).toContain(sampleLetter.signer.position.toUpperCase());
    expect(s).toContain(sampleLetter.center.regional.toUpperCase());
  });

  it('body paragraph contains intern full name and document number', () => {
    const body = buildBodyParagraph(sampleLetter);
    expect(body).toContain(sampleLetter.intern.fullName);
    expect(body).toContain(sampleLetter.intern.documentNumber);
    expect(body).toContain(formatDateLong(sampleLetter.period.startDate));
    expect(body).toContain(formatDateLong(sampleLetter.period.endDate));
  });

  it('closing, instructor, drafter and footer lines render content', () => {
    expect(buildClosing(sampleLetter)).toMatch(/Medellín/);
    expect(buildInstructorLine(sampleLetter)).toContain(sampleLetter.instructor.email);
    expect(buildDrafterLine(sampleLetter)).toContain('Proyectó');
    expect(buildFooterLine(sampleLetter)).toContain(sampleLetter.center.documentCode);
  });

  it('strengths intro is stable for preview', () => {
    expect(buildStrengthsIntro()).toBe('Demostró fortalezas Técnicas en:');
  });
});
