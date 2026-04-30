import { describe, expect, it } from 'vitest';
import { isEmailValid, isValidLetter, validateLetter } from './validators';
import { sampleLetter, emptyLetter } from '@/data/defaultLetter';
import type { Letter } from '@/types/letter';

describe('validateLetter', () => {
  it('returns no errors for sampleLetter', () => {
    expect(validateLetter(sampleLetter)).toEqual({});
    expect(isValidLetter(sampleLetter)).toBe(true);
  });

  it('flags empty required fields on emptyLetter', () => {
    const errors = validateLetter(emptyLetter);
    expect(errors['intern.fullName']).toBeDefined();
    expect(errors['intern.documentNumber']).toBeDefined();
    expect(errors['activities.tasks']).toBeDefined();
  });

  it('rejects end date before or equal to start date', () => {
    const bad: Letter = {
      ...sampleLetter,
      period: { ...sampleLetter.period, startDate: '2025-12-02', endDate: '2025-06-03' },
    };
    const errors = validateLetter(bad);
    expect(errors['period.endDate']).toMatch(/posterior/);
  });

  it('rejects invalid email', () => {
    const bad: Letter = {
      ...sampleLetter,
      instructor: { ...sampleLetter.instructor, email: 'not-an-email' },
    };
    expect(validateLetter(bad)['instructor.email']).toBeDefined();
  });

  it('accepts when at least one non-empty task is present', () => {
    const letter: Letter = {
      ...sampleLetter,
      activities: { ...sampleLetter.activities, tasks: ['', 'tarea válida'] },
    };
    expect(validateLetter(letter)['activities.tasks']).toBeUndefined();
  });
});

describe('isEmailValid', () => {
  it('accepts normal emails', () => {
    expect(isEmailValid('foo@bar.com')).toBe(true);
  });
  it('rejects malformed emails', () => {
    expect(isEmailValid('noop')).toBe(false);
    expect(isEmailValid('a@b')).toBe(false);
  });
});
