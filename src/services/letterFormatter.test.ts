import { describe, expect, it } from 'vitest';
import {
  buildBodyParagraph,
  buildClassificationLabel,
  buildClosing,
  buildDrafterLine,
  buildFooterLine,
  buildInstructorLine,
  buildSubtitle,
  buildTitle,
} from './letterFormatter';
import { sampleLetter } from '@/data/defaultLetter';

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
    expect(body).toContain('3 de junio de 2025');
    expect(body).toContain('2 de diciembre de 2025');
  });

  it('classification labels map to Spanish', () => {
    expect(buildClassificationLabel({ ...sampleLetter })).toBe('Pública');
    expect(
      buildClassificationLabel({
        ...sampleLetter,
        metadata: { ...sampleLetter.metadata, classification: 'classified' },
      })
    ).toBe('Clasificada');
    expect(
      buildClassificationLabel({
        ...sampleLetter,
        metadata: { ...sampleLetter.metadata, classification: 'reserved' },
      })
    ).toBe('Reservada');
  });

  it('closing, instructor, drafter and footer lines render content', () => {
    expect(buildClosing(sampleLetter)).toMatch(/Medellín/);
    expect(buildInstructorLine(sampleLetter)).toContain(sampleLetter.instructor.email);
    expect(buildDrafterLine(sampleLetter)).toContain('Proyectó');
    expect(buildFooterLine(sampleLetter)).toContain(sampleLetter.center.documentCode);
  });
});
