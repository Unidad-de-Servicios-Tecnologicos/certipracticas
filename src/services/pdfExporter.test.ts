import { describe, expect, it, vi } from 'vitest';
import { exportLetterAsPDF } from './pdfExporter';
import { sampleLetter } from '@/data/defaultLetter';
import { createDefaultDocumentSchema } from './editorSchemaService';

const saveMock = vi.fn();
const addImageMock = vi.fn();
const addPageMock = vi.fn();

vi.mock('jspdf', () => ({
  jsPDF: vi.fn().mockImplementation(() => ({
    addImage: addImageMock,
    addPage: addPageMock,
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    splitTextToSize: vi.fn((text) => [text]),
    save: saveMock,
  })),
}));

describe('exportLetterAsPDF', () => {
  it('invokes jsPDF.save with a letter-named file', async () => {
    const el = document.createElement('div');
    const page = document.createElement('div');
    page.setAttribute('data-letter-page', '1');
    el.appendChild(page);

    await exportLetterAsPDF(el, sampleLetter, {
      signature: null,
      signatureLayout: { xPct: 22, yPct: 84, scale: 1, rotationDeg: 0, align: 'left' },
      documentSchema: createDefaultDocumentSchema(),
      textOverrides: {},
    });

    expect(saveMock).toHaveBeenCalledTimes(1);
    const fname = saveMock.mock.calls[0][0];
    expect(fname).toMatch(/^Carta_/);
    expect(fname).toMatch(/\.pdf$/);
  });
});
