import { Document, Packer, Paragraph, ImageRun, AlignmentType, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import type { Letter } from '@/types/letter';
import type { SignatureData, SignatureLayout } from '@/types/signature';
import type { DocumentSchema, LogoNode } from '@/types/editorSchema';
import { formatDateFileSafe } from '@/utils/formatDate';
import { buildLetterFilename } from '@/utils/fileDownload';
import { formatDateLong } from '@/utils/formatDate';

interface ExportDocxOptions {
  signature: SignatureData | null;
  signatureLayout: SignatureLayout;
  documentSchema: DocumentSchema;
  textOverrides: Record<string, string>;
}
function val(value: string | undefined | null, fieldName: string): string {
  return value && value.trim() !== '' ? value : `[${fieldName}]`;
}

export async function exportLetterAsDOCX(
  letter: Letter,
  options: ExportDocxOptions
): Promise<void> {
  const { signature, signatureLayout, documentSchema, textOverrides } = options;
  const docDate = formatDateLong(letter.metadata.issueDate) || '[Fecha de expedición]';
  const tasks = letter.activities.tasks.filter((p) => p.code.trim() || p.name.trim() || p.description.trim());
  const headerTitle =
    textOverrides.signerHeader ||
    `El ${(letter.signer.position || '[Cargo del firmante]').toUpperCase()} DEL ${(letter.center.name || '[Centro]').toUpperCase()}`;
  const haceConstar = textOverrides.haceConstar || 'HACE CONSTAR QUE:';
  const contactPrefix =
    textOverrides.contactPrefix || 'Cualquier información adicional será suministrada por el experto';
  const issuedPrefix =
    textOverrides.issuedPrefix || 'Se expide esta constancia a solicitud del interesado';

  const lines: Paragraph[] = [];
  lines.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: val(letter.metadata.documentNumber, 'Número de documento'), size: 22 })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: headerTitle, bold: true, size: 24 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: haceConstar, bold: true, size: 23 })] })
  );
  lines.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: `${val(letter.intern.fullName, 'Nombre completo')} identificado con ${val(letter.intern.documentType, 'Tipo doc')} ${val(letter.intern.documentNumber, 'Número')} realizó su práctica desde ${val(formatDateLong(letter.period.startDate), 'Fecha inicio')} hasta ${val(formatDateLong(letter.period.endDate), 'Fecha fin')}, participó como apoyo técnico en los siguientes proyectos:`,
          size: 22,
        }),
      ],
    })
  );
  for (let i = 0; i < tasks.length; i++) {
    const p = tasks[i];
    const label = [p.code, p.name].filter(Boolean).join(' - ');
    lines.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${i + 1}. ${label}${label && p.description ? ': ' : ''}${p.description}`,
            size: 22,
          }),
        ],
      })
    );
  }

  const ext = letter.instructor.extension?.trim() ? ` extensión ${letter.instructor.extension.trim()}` : '';
  lines.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: `${contactPrefix} ${val(letter.instructor.fullName, 'Nombre del experto')} al teléfono ${val(letter.instructor.phone, 'Teléfono')}${ext} o al correo ${val(letter.instructor.email, 'Email')}.`,
          size: 22,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [new TextRun({ text: `${issuedPrefix} el ${docDate} en la ciudad de ${val(letter.metadata.city, 'Ciudad')}.`, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun({ text: '' })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val(letter.signer.fullName, 'Firmante').toUpperCase(), bold: true, size: 23 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val(letter.signer.position, 'Cargo firmante'), bold: true, size: 22 })] })
  );

  async function dataFromUrl(url: string): Promise<Uint8Array | null> {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    } catch {
      return null;
    }
  }

  const headerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'header' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);
  for (const logo of headerLogos) {
    const data = await dataFromUrl(logo.src);
    if (!data) continue;
    lines.unshift(
      new Paragraph({
        alignment: logo.align === 'left' ? AlignmentType.LEFT : logo.align === 'right' ? AlignmentType.RIGHT : AlignmentType.CENTER,
        children: [new ImageRun({ data, type: 'png', transformation: { width: Math.round(logo.widthPx), height: Math.round(logo.heightPx) } })],
      })
    );
  }

  if (signature?.dataUrl) {
    const signatureData = await dataFromUrl(signature.dataUrl);
    if (signatureData) {
      lines.push(
        new Paragraph({
          alignment:
            signatureLayout.align === 'left'
              ? AlignmentType.LEFT
              : signatureLayout.align === 'right'
                ? AlignmentType.RIGHT
                : AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: signatureData,
              type: 'png',
              transformation: { width: Math.round(180 * signatureLayout.scale), height: Math.round(64 * signatureLayout.scale) },
            }),
          ],
        })
      );
    }
  }

  lines.push(
    new Paragraph({
      children: [new TextRun({ text: `Proyectó: ${val(letter.drafter.fullName, 'Nombre proyectó')} - ${val(letter.drafter.role, 'Cargo proyectó')}`, size: 18 })],
    })
  );

  const doc = new Document({
    sections: [
      {
        children: lines,
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  const filename = buildLetterFilename(
    letter.intern.fullName,
    formatDateFileSafe(letter.metadata.issueDate),
    'docx'
  );
  saveAs(blob, filename);
}
