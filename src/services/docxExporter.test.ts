import { describe, expect, it, vi } from 'vitest';
import { exportLetterAsDOCX } from './docxExporter';
import { sampleLetter } from '@/data/defaultLetter';

const saveAsMock = vi.fn();
vi.mock('file-saver', () => ({ saveAs: (...args: unknown[]) => saveAsMock(...args) }));

describe('exportLetterAsDOCX', () => {
  it('generates a blob and saves with a letter-named docx filename', async () => {
    await exportLetterAsDOCX(sampleLetter);
    expect(saveAsMock).toHaveBeenCalled();
    const [, filename] = saveAsMock.mock.calls[0];
    expect(filename).toMatch(/^Carta_/);
    expect(filename).toMatch(/\.docx$/);
  });
});
