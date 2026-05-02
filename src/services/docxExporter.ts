import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertMillimetersToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import type { Letter } from '@/types/letter';
import type { SignatureData, SignatureLayout } from '@/types/signature';
import type { DocumentSchema, LogoNode } from '@/types/editorSchema';
import { formatDateFileSafe, formatDateLong } from '@/utils/formatDate';
import { buildLetterFilename } from '@/utils/fileDownload';
import { getGenderTerms } from '@/services/letterFormatter';

interface ExportDocxOptions {
  signature: SignatureData | null;
  signatureLayout: SignatureLayout;
  documentSchema: DocumentSchema;
  textOverrides: Record<string, string>;
}

function v(value: string | undefined | null, field: string): string {
  return value?.trim() ? value.trim() : `[${field}]`;
}

async function dataFromUrl(url: string): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await fetch(url).then((r) => r.arrayBuffer()));
  } catch { return null; }
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const FONT = 'Inter';
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const NO_BORDERS = {
  top: NO_BORDER, bottom: NO_BORDER,
  left: NO_BORDER, right: NO_BORDER,
  insideH: NO_BORDER, insideV: NO_BORDER,
};

function run(text: string, bold = false, size = 22, color = '000000'): TextRun {
  return new TextRun({ text, bold, size, color, font: FONT });
}

function jpara(
  children: TextRun[],
  align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.JUSTIFIED,
  spacingAfterMm = 3,
  indentLeft = 0,
  indentHanging = 0,
): Paragraph {
  return new Paragraph({
    alignment: align,
    spacing: { after: convertMillimetersToTwip(spacingAfterMm), line: 276 },
    indent: (indentLeft || indentHanging)
      ? { left: convertMillimetersToTwip(indentLeft), hanging: convertMillimetersToTwip(indentHanging) }
      : undefined,
    children,
  });
}

export async function exportLetterAsDOCX(
  letter: Letter,
  options: ExportDocxOptions,
): Promise<void> {
  const { signature, signatureLayout, documentSchema, textOverrides } = options;
  const terms = getGenderTerms(letter.intern.gender);

  // ── Header: all logos centered ────────────────────────────────────────────
  const headerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'header' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);

  // Split logos by alignment to build a 2-col table (left | right)
  const leftLogos = headerLogos.filter((l) => l.align === 'left');
  const rightLogos = headerLogos.filter((l) => l.align === 'right');
  const centerLogos = headerLogos.filter((l) => l.align === 'center');

  async function buildLogoCell(
    logos: LogoNode[],
    align: (typeof AlignmentType)[keyof typeof AlignmentType],
  ): Promise<TableCell> {
    const children: Paragraph[] = [];
    for (const logo of logos) {
      const data = await dataFromUrl(logo.src);
      if (!data) continue;
      children.push(new Paragraph({
        alignment: align,
        children: [new ImageRun({
          data, type: 'png',
          transformation: {
            width: Math.round(logo.widthPx * 0.75),
            height: Math.round(logo.heightPx * 0.75),
          },
        })],
      }));
    }
    if (!children.length) children.push(new Paragraph({ children: [] }));
    return new TableCell({ borders: NO_BORDERS, width: { size: 50, type: WidthType.PERCENTAGE }, children });
  }

  // If there are left/right logos → 2-col table; otherwise everything centered
  let headerContent: (Table | Paragraph)[];
  if (leftLogos.length || rightLogos.length) {
    headerContent = [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: [new TableRow({
          children: [
            await buildLogoCell(leftLogos, AlignmentType.LEFT),
            await buildLogoCell(rightLogos, AlignmentType.RIGHT),
          ],
        })],
      }),
      ...(centerLogos.length
        ? await Promise.all(centerLogos.map(async (logo) => {
            const data = await dataFromUrl(logo.src);
            if (!data) return new Paragraph({ children: [] });
            return new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new ImageRun({ data, type: 'png', transformation: { width: Math.round(logo.widthPx * 0.75), height: Math.round(logo.heightPx * 0.75) } })],
            });
          }))
        : []),
    ];
  } else {
    // All logos centered in one row
    const logoRuns: ImageRun[] = [];
    for (const logo of headerLogos) {
      const data = await dataFromUrl(logo.src);
      if (!data) continue;
      logoRuns.push(new ImageRun({
        data, type: 'png',
        transformation: {
          width: Math.round(logo.widthPx * 0.75),
          height: Math.round(logo.heightPx * 0.75),
        },
      }));
    }
    headerContent = [new Paragraph({ alignment: AlignmentType.CENTER, children: logoRuns })];
  }

  // ── Footer: green text ────────────────────────────────────────────────────
  const footerLogos = documentSchema.pages[0].elements
    .filter((e): e is LogoNode => e.type === 'logo' && e.section === 'footer' && !!e.src)
    .sort((a, b) => a.zIndex - b.zIndex);

  const footerLogoRuns: ImageRun[] = [];
  for (const logo of footerLogos) {
    const data = await dataFromUrl(logo.src);
    if (!data) continue;
    footerLogoRuns.push(new ImageRun({
      data, type: 'png',
      transformation: { width: Math.round(logo.widthPx * 0.5), height: Math.round(logo.heightPx * 0.5) },
    }));
  }

  const footerParagraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [run(`Regional ${v(letter.center.regional, 'Regional')}/ ${v(letter.center.name, 'Centro')}`, true, 18, '5a9e1a')],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [run(`${v(letter.center.address, 'Dirección')} - PBX ${v(letter.center.phone, 'Teléfono')}`, false, 18, '5a9e1a')],
    }),
    ...(footerLogoRuns.length
      ? [new Paragraph({ alignment: AlignmentType.CENTER, children: footerLogoRuns })]
      : []),
  ];

  // ── Text overrides ────────────────────────────────────────────────────────
  const signerHeader = textOverrides.signerHeader ||
    `EL ${v(letter.signer.position, 'Cargo').toUpperCase()} DEL ${v(letter.center.name, 'Centro').toUpperCase()}`;
  const haceConstar = textOverrides.haceConstar || 'HACE CONSTAR QUE:';
  const contactPrefix = textOverrides.contactPrefix ||
    'Cualquier información adicional será suministrada por el experto';
  const issuedPrefix = textOverrides.issuedPrefix ||
    'Se expide esta constancia a solicitud del interesado';
  const place = letter.period.area || letter.period.unit || letter.center.name || '[Tecnoparque Nodo]';

  const tasks = letter.activities.tasks.filter(
    (t) => t.code.trim() || t.name.trim() || t.description.trim(),
  );

  // ── Signature: inline above signer, horizontally placed by xPct ──────────
  let signaturePara: Paragraph | null = null;
  if (signature?.dataUrl) {
    const xPct = signatureLayout.xPct;
    const sigAlign = xPct < 35 ? AlignmentType.LEFT : xPct > 65 ? AlignmentType.RIGHT : AlignmentType.CENTER;
    signaturePara = new Paragraph({
      alignment: sigAlign,
      spacing: { after: convertMillimetersToTwip(1) },
      children: [new ImageRun({
        data: dataUrlToBytes(signature.dataUrl),
        type: 'png',
        transformation: {
          width: Math.round(180 * signatureLayout.scale),
          height: Math.round(64 * signatureLayout.scale),
        },
      })],
    });
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  const body: Paragraph[] = [
    // Document number
    jpara([run(v(letter.metadata.documentNumber, 'Número de documento'), false, 22)], AlignmentType.CENTER, 8),

    // Signer header (bold, centered)
    jpara([run(signerHeader, true, 24)], AlignmentType.CENTER, 4),

    // HACE CONSTAR QUE
    jpara([run(haceConstar, true, 23)], AlignmentType.CENTER, 8),

    // Body paragraph – mixed bold/normal, justified
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: convertMillimetersToTwip(4), line: 276 },
      children: [
        run(v(letter.intern.fullName, 'Nombre completo'), true),
        run(`, ${terms.identificado} con la ${v(letter.intern.documentType, 'Tipo doc')} Número `),
        run(v(letter.intern.documentNumber, 'Número'), true),
        run(` expedida en ${v(letter.intern.documentCity, 'Ciudad')}, de la `),
        run(v(letter.intern.program, 'Programa'), true),
        run(`; realizó su practica en la modalidad de ${v(letter.period.modality, 'Modalidad')} en ${place} desde el `),
        run(v(formatDateLong(letter.period.startDate), 'Fecha inicio'), true),
        run(', hasta el '),
        run(v(formatDateLong(letter.period.endDate), 'Fecha fin'), true),
        run(', participó como apoyo técnico en los siguientes proyectos:'),
      ],
    }),

    // Projects list
    ...tasks.map((task, i) => {
      const label = [task.code.trim(), task.name.trim()].filter(Boolean).join(' – ');
      return jpara(
        [
          run(`${i + 1}.  `, true),
          run(label, true),
          ...(task.description ? [run(`: ${task.description}`)] : []),
        ],
        AlignmentType.JUSTIFIED,
        2,
        8,
        6,
      );
    }),

    jpara([], AlignmentType.LEFT, 2),

    // Contact (justified)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: convertMillimetersToTwip(4), line: 276 },
      children: [
        run(`${contactPrefix} `),
        run(v(letter.instructor.fullName, 'Experto'), true),
        run(`, en el teléfono ${v(letter.instructor.phone, 'Teléfono')}, o en correo electrónico `),
        run(v(letter.instructor.email, 'Email'), true),
      ],
    }),

    // Issue date (justified, slight indent)
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: convertMillimetersToTwip(14), line: 276 },
      indent: { left: convertMillimetersToTwip(4) },
      children: [
        run(`${issuedPrefix} el `),
        run(v(formatDateLong(letter.metadata.issueDate), 'Fecha de expedición'), true),
        run(` en la ciudad de ${v(letter.metadata.city, 'Ciudad')}`),
      ],
    }),

    // Signer block (centered, bold)
    jpara([run(v(letter.signer.fullName, 'Firmante').toUpperCase(), true, 23)], AlignmentType.CENTER, 1),
    jpara([run(v(letter.signer.position, 'Cargo firmante'), true, 22)], AlignmentType.CENTER, 1),
    jpara([run(v(letter.center.name, 'Centro'), true, 22)], AlignmentType.CENTER, 10),

    // Firma encima del bloque Proyectó
    ...(signaturePara ? [signaturePara] : []),

    // Proyectó
    jpara([run(`Proyectó: ${v(letter.drafter.fullName, 'Nombre proyectó')}`, false, 18)], AlignmentType.LEFT, 1),
    jpara([run(v(letter.drafter.role, 'Cargo proyectó'), false, 18)], AlignmentType.LEFT, 0),
  ];

  // ── Assemble document ─────────────────────────────────────────────────────
  const doc = new Document({
    sections: [{
      headers: { default: new Header({ children: headerContent }) },
      footers: { default: new Footer({ children: footerParagraphs }) },
      properties: {
        page: {
          size: {
            width: convertMillimetersToTwip(210),
            height: convertMillimetersToTwip(297),
          },
          margin: {
            top: convertMillimetersToTwip(20),
            bottom: convertMillimetersToTwip(20),
            left: convertMillimetersToTwip(25),
            right: convertMillimetersToTwip(25),
            header: convertMillimetersToTwip(10),
            footer: convertMillimetersToTwip(10),
          },
        },
      },
      children: body,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, buildLetterFilename(letter.intern.fullName, formatDateFileSafe(letter.metadata.issueDate), 'docx'));
}
