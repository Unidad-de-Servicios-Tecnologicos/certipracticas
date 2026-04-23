import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import type { Letter } from '@/types/letter';
import { buildLetterFilename } from '@/utils/fileDownload';
import { formatDateFileSafe } from '@/utils/formatDate';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function exportLetterAsPDF(element: HTMLElement, letter: Letter): Promise<void> {
  const pages = Array.from(element.querySelectorAll<HTMLElement>('[data-letter-page]'));
  const targets = pages.length > 0 ? pages : [element];

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  for (let i = 0; i < targets.length; i++) {
    // Forzamos las dimensiones A4 en pixeles a 96dpi aprox y eliminamos márgenes visuales de la previsualización
    const imgData = await toPng(targets[i], {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      width: 794,
      height: 1123,
      style: {
        margin: '0',
        boxShadow: 'none',
        transform: 'none',
      },
    });
    const imgProps = pdf.getImageProperties(imgData);
    const width = A4_WIDTH_MM;
    const height = (imgProps.height * width) / imgProps.width;
    const safeHeight = Math.min(height, A4_HEIGHT_MM);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 0, width, safeHeight);
  }

  const filename = buildLetterFilename(
    letter.intern.fullName,
    formatDateFileSafe(letter.metadata.issueDate),
    'pdf'
  );
  pdf.save(filename);
}
