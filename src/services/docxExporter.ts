import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Footer,
} from 'docx';
import { saveAs } from 'file-saver';
import type { Letter } from '@/types/letter';
import { formatDateFileSafe, formatDateShort } from '@/utils/formatDate';
import { buildLetterFilename } from '@/utils/fileDownload';
import { getGenderTerms } from '@/services/letterFormatter';

function val(value: string | undefined | null, fieldName: string): string {
  return value && value.trim() !== '' ? value : `[${fieldName}]`;
}

function p(text: string, opts?: { bold?: boolean; align?: any; size?: number; color?: string; font?: string }): Paragraph {
  const runConfig: any = { text, size: opts?.size ?? 22 };
  if (opts?.bold !== undefined) runConfig.bold = opts.bold;
  if (opts?.color !== undefined) runConfig.color = opts.color;
  if (opts?.font !== undefined) runConfig.font = opts.font;

  return new Paragraph({
    alignment: opts?.align,
    children: [new TextRun(runConfig)],
  });
}

function emptyBr(): Paragraph {
  return new Paragraph({ children: [new TextRun({ text: '', size: 10 })] });
}

export async function exportLetterAsDOCX(letter: Letter): Promise<void> {
  const { intern, period, center, signer, drafter, metadata, instructor, activities } = letter;
  const tasks = activities.tasks.filter((t) => t.trim().length > 0);
  const strengths = activities.technicalStrengths.filter((s) => s.trim().length > 0);

  // Fetch logos safely
  let logoData: Uint8Array | null = null;
  try {
    const res = await fetch('/logo.png');
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      logoData = new Uint8Array(buffer);
    }
  } catch (e) {
    console.warn('Could not load logo for DOCX', e);
  }

  const isPublic = metadata.classification === 'public';
  const isClassified = metadata.classification === 'classified';
  const isReserved = metadata.classification === 'reserved';

  const terms = getGenderTerms(intern.gender);
  const Title = `CERTIFICACIÓN DE EJECUCIÓN DE ETAPA PRODUCTIVA EN EL ${val(center.name, 'Nombre del centro').toUpperCase()}`;
  const Subtitle = `EL ${val(signer.position, 'Cargo').toUpperCase()} DEL ${val(center.name, 'Nombre del centro').toUpperCase()}, REGIONAL ${val(center.regional, 'Regional').toUpperCase()} DEL SENA, HACE CONSTAR:`;
  const Body = `Que, cumplidos ${val(period.duration, 'Duración')} desde el ${val(formatDateShort(period.startDate), 'Fecha de inicio')} al ${val(formatDateShort(period.endDate), 'Fecha fin')}, ${terms.joven} ${val(intern.fullName, 'Nombre completo')}, ${terms.identificado} con ${val(intern.documentType, 'Tipo de documento')}: ${val(intern.documentNumber, 'Número de documento')} ${terms.expedida} en ${val(intern.documentCity, 'Ciudad de expedición')}, finalizó su proceso de etapa productiva bajo la modalidad de ${val(period.modality, 'Modalidad')}, en el ${val(center.name, 'Nombre del centro')} donde desarrolló su práctica en la ${val(period.unit, 'Unidad')} en el área de ${val(period.area, 'Área')} como ${val(intern.program, 'Programa')} del ${val(center.name, 'Nombre del centro')}.`;

  const solidBorder = { style: BorderStyle.SINGLE, size: 1, color: "000000" };

  const classificationTable = new Table({
    width: { size: 80, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: { top: solidBorder, bottom: solidBorder, left: solidBorder, right: solidBorder, insideHorizontal: solidBorder, insideVertical: solidBorder },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 6,
            shading: { fill: "000000" },
            margins: { top: 60, bottom: 60 },
            children: [p("CLASIFICACIÓN DE LA INFORMACIÓN", { bold: true, color: "FFFFFF", align: AlignmentType.CENTER, size: 18 })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ margins: { left: 60, right: 60 }, children: [p("Pública", { bold: true, size: 18 })] }),
          new TableCell({ margins: { left: 60, right: 60 }, children: [p(isPublic ? "x" : "\u00A0", { bold: true, size: 18, align: AlignmentType.CENTER })] }),
          new TableCell({ margins: { left: 60, right: 60 }, children: [p("Pública Clasificada", { size: 18 })] }),
          new TableCell({ margins: { left: 60, right: 60 }, children: [p(isClassified ? "x" : "\u00A0", { bold: true, size: 18, align: AlignmentType.CENTER })] }),
          new TableCell({ margins: { left: 60, right: 60 }, children: [p("Pública Reservada", { size: 18 })] }),
          new TableCell({ margins: { left: 60, right: 60 }, children: [p(isReserved ? "x" : "\u00A0", { bold: true, size: 18, align: AlignmentType.CENTER })] }),
        ],
      }),
    ],
  });

  const headerLogo = logoData ? new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ImageRun({ data: logoData, type: "png", transformation: { width: 75, height: 75 } })]
  }) : emptyBr();

  const bodyChildren = [
    headerLogo,
    emptyBr(),
    classificationTable,
    emptyBr(),
    p(`${val(metadata.documentNumber, 'Número de documento')}`, { align: AlignmentType.CENTER, size: 20 }),
    p(`${val(metadata.city, 'Ciudad')}, ${val(formatDateShort(metadata.issueDate), 'Fecha')}.`, { align: AlignmentType.CENTER, size: 20 }),
    emptyBr(),
    emptyBr(),
    p(Title, { bold: true, align: AlignmentType.CENTER, size: 22 }),
    emptyBr(),
    emptyBr(),
    p(Subtitle, { bold: true, align: AlignmentType.CENTER, size: 22 }),
    emptyBr(),
    p(Body, { align: AlignmentType.JUSTIFIED, size: 22 }),
    emptyBr(),
    p(`Dentro de las actividades realizadas por ${terms.practicante} en la ${val(period.area, 'Área')} se encuentran:`, { size: 22 }),
    emptyBr(),
    ...tasks.map((t) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: t, size: 22 })] })),
    emptyBr(),
    p('Demostró fortalezas Técnicas en:', { size: 22 }),
    emptyBr(),
    ...strengths.map((s) => new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: s, size: 22 })] })),
    emptyBr(),
    p(val(activities.performanceReview, 'Evaluación general del desempeño'), { align: AlignmentType.JUSTIFIED, size: 22 }),
    emptyBr(),
    p(`Cualquier información adicional será suministrada por el instructor de etapa productiva ${val(instructor.fullName, 'Nombre del instructor')} al teléfono ${val(instructor.phone, 'Teléfono')} o al correo `, { size: 22 }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: val(instructor.email, 'Email'), color: "1155CC", size: 22 })
      ]
    }),
    emptyBr(),
    p(`${val(metadata.city, 'Ciudad')}, ${val(formatDateShort(metadata.issueDate), 'Fecha')}.`, { size: 22 }),
    emptyBr(),
    p('Cordialmente,', { size: 22 }),
    emptyBr(),
    emptyBr(),
    emptyBr(),
    p(val(signer.fullName, 'Nombre del firmante').toUpperCase(), { bold: true, align: AlignmentType.CENTER, size: 22 }),
    p(val(signer.position, 'Cargo del firmante'), { align: AlignmentType.CENTER, bold: true, size: 22 }),
    emptyBr(),
    p(`Proyectó: ${val(drafter.fullName, 'Nombre proyectó')}. ${val(drafter.role, 'Rol proyectó')}.`, { size: 18 }),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial" },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1100, right: 1400, bottom: 1400, left: 1400 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${val(center.documentCode, 'Código')} ${val(center.documentVersion, 'Versión')}`,
                    size: 16,
                    color: "808080",
                  }),
                ],
              }),
            ],
          }),
        },
        children: bodyChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = buildLetterFilename(
    intern.fullName,
    formatDateFileSafe(metadata.issueDate),
    'docx'
  );
  saveAs(blob, filename);
}
