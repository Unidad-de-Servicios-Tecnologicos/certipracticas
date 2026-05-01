import { jsPDF } from 'jspdf';
import type { Letter } from '@/types/letter';
import type { SignatureData, SignatureLayout } from '@/types/signature';
import type { DocumentSchema, LogoNode } from '@/types/editorSchema';
import { buildLetterFilename } from '@/utils/fileDownload';
import { formatDateFileSafe } from '@/utils/formatDate';
import { formatDateLong } from '@/utils/formatDate';

interface ExportPdfOptions {
  signature: SignatureData | null;
  signatureLayout: SignatureLayout;
  documentSchema: DocumentSchema;
  textOverrides: Record<string, string>;
}

export async function exportLetterAsPDF(
  _element: HTMLElement,
  letter: Letter,
  options: ExportPdfOptions
): Promise<void> {
  const { signature, signatureLayout, documentSchema, textOverrides } = options;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const left = 22;
  const maxWidth = 166;
  let y = 20;

  async function toDataUrl(src: string): Promise<string | null> {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  const headerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'header' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);
  for (const logo of headerLogos) {
    const data = await toDataUrl(logo.src);
    if (!data) continue;
    const w = logo.widthPx * 0.12;
    const h = logo.heightPx * 0.12;
    const x = logo.align === 'left' ? left : logo.align === 'right' ? left + maxWidth - w : 105 - w / 2;
    pdf.addImage(data, 'PNG', x, y - 6, w, h);
  }
  y += 12;

  const signerHeader =
    textOverrides.signerHeader ||
    `EL ${(letter.signer.position || '[Cargo del firmante]').toUpperCase()} DEL ${(letter.center.name || '[Centro]').toUpperCase()}`;
  const haceConstar = textOverrides.haceConstar || 'HACE CONSTAR QUE:';
  const contactPrefix =
    textOverrides.contactPrefix || 'Cualquier información adicional será suministrada por el experto';
  const issuedPrefix =
    textOverrides.issuedPrefix || 'Se expide esta constancia a solicitud del interesado';

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(letter.metadata.documentNumber || '[Número de documento]', 105, y, { align: 'center' });
  y += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text(signerHeader, 105, y, { align: 'center', maxWidth });
  y += 7;
  pdf.text(haceConstar, 105, y, { align: 'center' });
  y += 9;

  pdf.setFont('helvetica', 'normal');
  const body = `${letter.intern.fullName || '[Nombre]'}, identificado con ${letter.intern.documentType || '[Tipo]'} ${letter.intern.documentNumber || '[Documento]'}, realizó su práctica desde ${formatDateLong(letter.period.startDate) || '[Inicio]'} hasta ${formatDateLong(letter.period.endDate) || '[Fin]'} y participó en los siguientes proyectos:`;
  const bodyFinal = body.replace('y participó en los siguientes proyectos:', 'participó como apoyo técnico en los siguientes proyectos:');
  const bodyLines = pdf.splitTextToSize(bodyFinal, maxWidth);
  pdf.text(bodyLines, left, y);
  y += bodyLines.length * 5 + 3;

  const tasks = letter.activities.tasks.filter((t) => t.code.trim() || t.name.trim() || t.description.trim());
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const line = `${i + 1}. ${[task.code, task.name].filter(Boolean).join(' - ')}${task.description ? `: ${task.description}` : ''}`;
    const lines = pdf.splitTextToSize(line, maxWidth - 4);
    pdf.text(lines, left + 2, y);
    y += lines.length * 5 + 1;
  }

  const ext = letter.instructor.extension?.trim() ? ` extensión ${letter.instructor.extension.trim()}` : '';
  const contact = `${contactPrefix} ${letter.instructor.fullName || '[Experto]'} al teléfono ${letter.instructor.phone || '[Teléfono]'}${ext} o al correo ${letter.instructor.email || '[Correo]'}.`;
  const contactLines = pdf.splitTextToSize(contact, maxWidth);
  pdf.text(contactLines, left, y);
  y += contactLines.length * 5 + 2;

  const issued = `${issuedPrefix} el ${formatDateLong(letter.metadata.issueDate) || '[Fecha]'} en la ciudad de ${letter.metadata.city || '[Ciudad]'}.`;
  const issuedLines = pdf.splitTextToSize(issued, maxWidth);
  pdf.text(issuedLines, left, y);
  y += issuedLines.length * 5 + 10;

  pdf.setFont('helvetica', 'bold');
  pdf.text((letter.signer.fullName || '[Firmante]').toUpperCase(), 105, y, { align: 'center' });
  y += 6;
  pdf.text(letter.signer.position || '[Cargo firmante]', 105, y, { align: 'center' });
  y += 10;

  if (signature?.dataUrl) {
    const sw = 180 * signatureLayout.scale * 0.12;
    const sh = 64 * signatureLayout.scale * 0.12;
    const sx =
      signatureLayout.align === 'left'
        ? left
        : signatureLayout.align === 'right'
          ? left + maxWidth - sw
          : 105 - sw / 2;
    pdf.addImage(signature.dataUrl, 'PNG', sx, y - 6, sw, sh);
    y += sh + 2;
  }

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Proyectó: ${letter.drafter.fullName || '[Nombre proyectó]'} - ${letter.drafter.role || '[Cargo proyectó]'}`, left, y);

  const footerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'footer' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);
  for (const logo of footerLogos) {
    const data = await toDataUrl(logo.src);
    if (!data) continue;
    const w = logo.widthPx * 0.12;
    const h = logo.heightPx * 0.12;
    const x = logo.align === 'left' ? left : logo.align === 'right' ? left + maxWidth - w : 105 - w / 2;
    pdf.addImage(data, 'PNG', x, 280 - h, w, h);
  }

  const filename = buildLetterFilename(
    letter.intern.fullName,
    formatDateFileSafe(letter.metadata.issueDate),
    'pdf'
  );
  pdf.save(filename);
}
