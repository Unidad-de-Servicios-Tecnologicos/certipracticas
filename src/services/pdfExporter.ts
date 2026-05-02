import { jsPDF } from 'jspdf';
import type { Letter } from '@/types/letter';
import type { SignatureData, SignatureLayout } from '@/types/signature';
import type { DocumentSchema, LogoNode } from '@/types/editorSchema';
import { buildLetterFilename } from '@/utils/fileDownload';
import { formatDateFileSafe, formatDateLong } from '@/utils/formatDate';
import { getGenderTerms } from '@/services/letterFormatter';

const L = 25; const R = 185; const CX = 105; const MW = 160;
const PW = 210; const PH = 297; const PX = 0.2646;
const GREEN: [number, number, number] = [90, 158, 26];
const BLACK: [number, number, number] = [0, 0, 0];

interface Seg { text: string; bold?: boolean; }

interface ExportPdfOptions {
  signature: SignatureData | null;
  signatureLayout: SignatureLayout;
  documentSchema: DocumentSchema;
  textOverrides: Record<string, string>;
}

function v(value: string | undefined | null, field: string): string {
  return value?.trim() ? value.trim() : `[${field}]`;
}

async function toDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

/**
 * Word-level rich text renderer with justification.
 * Returns Y coordinate of the line after the last rendered line.
 */
function richText(
  pdf: jsPDF,
  segs: Seg[],
  x: number,
  y: number,
  maxWidth: number,
  lineH: number,
  size: number,
  justify = true,
): number {
  interface Token { text: string; bold: boolean; w: number; }
  const tokens: Token[] = [];

  for (const seg of segs) {
    for (const part of seg.text.split(/( )/)) {
      if (!part) continue;
      pdf.setFont('helvetica', seg.bold ? 'bold' : 'normal');
      pdf.setFontSize(size);
      tokens.push({ text: part, bold: !!seg.bold, w: pdf.getTextWidth(part) });
    }
  }

  // Build lines
  const lines: Token[][] = [];
  let line: Token[] = []; let lineW = 0;
  for (const tok of tokens) {
    if (tok.text === ' ') {
      if (lineW + tok.w > maxWidth) { lines.push(line); line = []; lineW = 0; }
      else { line.push(tok); lineW += tok.w; }
      continue;
    }
    if (lineW + tok.w > maxWidth && line.length > 0) {
      while (line.length && line[line.length - 1].text === ' ') lineW -= line.pop()!.w;
      lines.push(line); line = []; lineW = 0;
    }
    line.push(tok); lineW += tok.w;
  }
  if (line.length) lines.push(line);

  // Render with justification
  let cy = y;
  for (let li = 0; li < lines.length; li++) {
    const ln = lines[li];
    const isLast = li === lines.length - 1;
    const words = ln.filter((t) => t.text !== ' ');
    const spaces = ln.filter((t) => t.text === ' ');
    const wordW = words.reduce((s, t) => s + t.w, 0);
    const extraPerSpace = justify && !isLast && spaces.length > 0
      ? (maxWidth - wordW) / spaces.length
      : 0;

    let cx = x;
    for (const tok of ln) {
      if (tok.text === ' ') { cx += tok.w + extraPerSpace; continue; }
      if (cx === x && tok.text === ' ') continue;
      pdf.setFont('helvetica', tok.bold ? 'bold' : 'normal');
      pdf.setFontSize(size);
      pdf.text(tok.text, cx, cy);
      cx += tok.w;
    }
    cy += lineH;
  }
  return cy - lineH;
}

export async function exportLetterAsPDF(
  _element: HTMLElement,
  letter: Letter,
  options: ExportPdfOptions,
): Promise<void> {
  const { signature, signatureLayout, documentSchema, textOverrides } = options;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── Header logos ─────────────────────────────────────────────────────────
  let y = 14;
  const headerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'header' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);

  let logoRowH = 0;
  for (const logo of headerLogos) {
    const data = await toDataUrl(logo.src);
    if (!data) continue;
    const w = logo.widthPx * PX; const h = logo.heightPx * PX;
    const x = logo.align === 'right' ? R - w : logo.align === 'center' ? CX - w / 2 : L;
    pdf.addImage(data, 'PNG', x, y, w, h);
    logoRowH = Math.max(logoRowH, h);
  }

  y += logoRowH + 3;
  pdf.setDrawColor(200, 200, 200); pdf.setLineWidth(0.3); pdf.line(L, y, R, y);
  y += 9;

  // ── Document number ──────────────────────────────────────────────────────
  pdf.setTextColor(...BLACK);
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11);
  pdf.text(v(letter.metadata.documentNumber, 'Número de documento'), CX, y, { align: 'center' });
  y += 10;

  // ── Signer header ────────────────────────────────────────────────────────
  const signerHeader = textOverrides.signerHeader ||
    `EL ${v(letter.signer.position, 'Cargo').toUpperCase()} DEL ${v(letter.center.name, 'Centro').toUpperCase()}`;
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  const headerLines = pdf.splitTextToSize(signerHeader, MW - 20);
  pdf.text(headerLines, CX, y, { align: 'center' });
  y += headerLines.length * 6.5 + 4;

  // ── HACE CONSTAR QUE ─────────────────────────────────────────────────────
  const haceConstar = textOverrides.haceConstar || 'HACE CONSTAR QUE:';
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  pdf.text(haceConstar, CX, y, { align: 'center' });
  y += 10;

  // ── Body paragraph (mixed bold/normal, justified) ────────────────────────
  const terms = getGenderTerms(letter.intern.gender);
  const place = letter.period.area || letter.period.unit || letter.center.name || '[Tecnoparque Nodo]';

  const bodySegs: Seg[] = [
    { text: v(letter.intern.fullName, 'Nombre completo'), bold: true },
    { text: `, ${terms.identificado} con la ${v(letter.intern.documentType, 'Tipo doc')} Número ` },
    { text: v(letter.intern.documentNumber, 'Número'), bold: true },
    { text: ` expedida en ${v(letter.intern.documentCity, 'Ciudad')}, de la ` },
    { text: v(letter.intern.program, 'Programa'), bold: true },
    { text: `; realizó su practica en la modalidad de ${v(letter.period.modality, 'Modalidad')} en ${place} desde el ` },
    { text: v(formatDateLong(letter.period.startDate), 'Fecha inicio'), bold: true },
    { text: ', hasta el ' },
    { text: v(formatDateLong(letter.period.endDate), 'Fecha fin'), bold: true },
    { text: ', participó como apoyo técnico en los siguientes proyectos:' },
  ];

  const lastBodyY = richText(pdf, bodySegs, L, y, MW, 6, 11);
  y = lastBodyY + 6 + 4;

  // ── Numbered projects (justified, hanging indent) ────────────────────────
  const tasks = letter.activities.tasks.filter(
    (t) => t.code.trim() || t.name.trim() || t.description.trim(),
  );
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const label = [task.code.trim(), task.name.trim()].filter(Boolean).join(' – ');
    // Render number at left margin, then text indented so continuation lines align
    const numStr = `${i + 1}.  `;
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
    const numW = pdf.getTextWidth(numStr);
    pdf.text(numStr, L, y);
    const itemSegs: Seg[] = [
      { text: label, bold: true },
      ...(task.description ? [{ text: `: ${task.description}` }] : []),
    ];
    const lastY = richText(pdf, itemSegs, L + numW, y, MW - numW, 6, 11);
    y = lastY + 6 + 3;
  }
  y += 2;

  // ── Contact (justified) ──────────────────────────────────────────────────
  const contactPrefix = textOverrides.contactPrefix ||
    'Cualquier información adicional será suministrada por el experto';
  const contactSegs: Seg[] = [
    { text: `${contactPrefix} ` },
    { text: v(letter.instructor.fullName, 'Nombre del experto'), bold: true },
    { text: `, en el teléfono ${v(letter.instructor.phone, 'Teléfono')}, o en correo electrónico ` },
    { text: v(letter.instructor.email, 'Email'), bold: true },
  ];
  const lastContactY = richText(pdf, contactSegs, L, y, MW, 6, 11);
  y = lastContactY + 6 + 5;

  // ── Issue date (justified) ───────────────────────────────────────────────
  const issuedPrefix = textOverrides.issuedPrefix ||
    'Se expide esta constancia a solicitud del interesado';
  const issuedSegs: Seg[] = [
    { text: `${issuedPrefix} el ` },
    { text: v(formatDateLong(letter.metadata.issueDate), 'Fecha de expedición'), bold: true },
    { text: ` en la ciudad de ${v(letter.metadata.city, 'Ciudad')}` },
  ];
  const lastIssuedY = richText(pdf, issuedSegs, L + 4, y, MW - 4, 6, 11);
  y = lastIssuedY + 6 + 14;

  // ── Signer block ─────────────────────────────────────────────────────────
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  pdf.text(v(letter.signer.fullName, 'Firmante'), CX, y, { align: 'center' }); y += 6;
  pdf.text(v(letter.signer.position, 'Cargo firmante'), CX, y, { align: 'center' }); y += 6;
  pdf.text(v(letter.center.name, 'Centro'), CX, y, { align: 'center' });

  // ── Proyectó + firma encima ───────────────────────────────────────────────
  pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...BLACK);
  const drafterY = 254;
  if (signature?.dataUrl) {
    const sigWmm = 180 * signatureLayout.scale * PX;
    const sigHmm = 64 * signatureLayout.scale * PX;
    // Firma encima de la línea "Proyectó:", alineada a la izquierda
    pdf.addImage(signature.dataUrl, 'PNG', L, drafterY - sigHmm - 1, sigWmm, sigHmm);
  }
  pdf.text(`Proyectó: ${v(letter.drafter.fullName, 'Nombre proyectó')}`, L, drafterY);
  pdf.text(v(letter.drafter.role, 'Cargo proyectó'), L, drafterY + 5);

  // ── Footer logos ──────────────────────────────────────────────────────────
  const footerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'footer' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);
  for (const logo of footerLogos) {
    const data = await toDataUrl(logo.src);
    if (!data) continue;
    const w = logo.widthPx * PX; const h = logo.heightPx * PX;
    const x = logo.align === 'right' ? R - w : logo.align === 'center' ? CX - w / 2 : L;
    pdf.addImage(data, 'PNG', x, 278 - h, w, h);
  }

  // ── Footer text (green) ───────────────────────────────────────────────────
  pdf.setDrawColor(200, 200, 200); pdf.setLineWidth(0.3); pdf.line(L, 263, R, 263);
  pdf.setTextColor(...GREEN); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9);
  pdf.text(`Regional ${v(letter.center.regional, 'Regional')}/ ${v(letter.center.name, 'Centro')}`, CX, 268, { align: 'center' });
  pdf.text(`${v(letter.center.address, 'Dirección')} - PBX ${v(letter.center.phone, 'Teléfono')}`, CX, 273, { align: 'center' });

  const docCode = letter.center.documentCode;
  const docVer = letter.center.documentVersion;
  if (docCode || docVer) {
    pdf.setTextColor(180, 180, 180); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7);
    pdf.text(`${docCode} ${docVer}`.trim(), R + 3, 278, { angle: 90 });
  }

  pdf.save(buildLetterFilename(letter.intern.fullName, formatDateFileSafe(letter.metadata.issueDate), 'pdf'));
}
