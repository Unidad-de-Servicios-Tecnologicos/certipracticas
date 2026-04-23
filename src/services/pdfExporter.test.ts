import { describe, expect, it, vi } from 'vitest';
import { exportLetterAsPDF } from './pdfExporter';
import { sampleLetter } from '@/data/defaultLetter';

const saveMock = vi.fn();
const addImageMock = vi.fn();
const addPageMock = vi.fn();

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    getImageProperties: vi.fn(() => ({ width: 794, height: 1123 })),
    addImage: addImageMock,
    addPage: addPageMock,
    save: saveMock,
  })),
}));

vi.mock('html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,AAA'),
}));

describe('exportLetterAsPDF', () => {
  it('invokes jsPDF.save with a letter-named file', async () => {
    const el = document.createElement('div');
    const page = document.createElement('div');
    page.setAttribute('data-letter-page', '1');
    el.appendChild(page);

    await exportLetterAsPDF(el, sampleLetter);

    expect(saveMock).toHaveBeenCalledTimes(1);
    const fname = saveMock.mock.calls[0][0];
    expect(fname).toMatch(/^Carta_/);
    expect(fname).toMatch(/\.pdf$/);
    expect(addImageMock).toHaveBeenCalled();
  });
});
