import type { DocumentSchema, ElementNode, LogoNode, SectionType } from '@/types/editorSchema';

const SCHEMA_VERSION = 1 as const;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeLogo(node: LogoNode): LogoNode {
  return {
    ...node,
    xPct: clamp(node.xPct, 0, 100),
    yPct: clamp(node.yPct, 0, 100),
    widthPx: clamp(node.widthPx, 24, 900),
    heightPx: clamp(node.heightPx, 24, 900),
    rotationDeg: clamp(node.rotationDeg, -180, 180),
    opacity: clamp(node.opacity, 0, 1),
    zIndex: clamp(node.zIndex, 1, 999),
  };
}

export function createDefaultDocumentSchema(): DocumentSchema {
  const defaultHeaderLogo = createLogoNode({
    id: 'default-header-logo',
    src: '/logo.png',
    name: 'Logo SENA',
    section: 'header',
    xPct: 50,
    yPct: 8,
    widthPx: 170,
    heightPx: 68,
    zIndex: 1,
  });
  return {
    version: SCHEMA_VERSION,
    pageSize: 'a4',
    grid: { enabled: false, size: 12, snap: false },
    pages: [{ id: 'page-1', elements: [defaultHeaderLogo] }],
  };
}

export function createLogoNode(partial?: Partial<LogoNode>): LogoNode {
  return normalizeLogo({
    id: partial?.id ?? crypto.randomUUID(),
    type: 'logo',
    section: partial?.section ?? 'header',
    src: partial?.src ?? '',
    name: partial?.name ?? 'Logo',
    xPct: partial?.xPct ?? 50,
    yPct: partial?.yPct ?? (partial?.section === 'footer' ? 94 : 8),
    widthPx: partial?.widthPx ?? 110,
    heightPx: partial?.heightPx ?? 56,
    rotationDeg: partial?.rotationDeg ?? 0,
    opacity: partial?.opacity ?? 1,
    align: partial?.align ?? 'center',
    zIndex: partial?.zIndex ?? 10,
    locked: partial?.locked ?? false,
  });
}

export function getFirstPageElements(schema: DocumentSchema): ElementNode[] {
  return schema.pages[0]?.elements ?? [];
}

export function getLogoNodesBySection(schema: DocumentSchema, section: SectionType): LogoNode[] {
  return getFirstPageElements(schema)
    .filter((node): node is LogoNode => node.type === 'logo' && node.section === section)
    .sort((a, b) => a.zIndex - b.zIndex);
}

export function sanitizeDocumentSchema(raw: unknown): DocumentSchema {
  const fallback = createDefaultDocumentSchema();
  if (!raw || typeof raw !== 'object') return fallback;

  const candidate = raw as Partial<DocumentSchema>;
  const elements = candidate.pages?.[0]?.elements ?? [];
  const sanitizedElements: ElementNode[] = elements
    .filter((node: any) => node && typeof node === 'object' && node.type === 'logo')
    .map((node: any) => normalizeLogo(createLogoNode(node)));
  const ensuredElements = sanitizedElements.length
    ? sanitizedElements
    : createDefaultDocumentSchema().pages[0].elements;

  return {
    version: SCHEMA_VERSION,
    pageSize: candidate.pageSize === 'carta' ? 'carta' : 'a4',
    grid: {
      enabled: Boolean(candidate.grid?.enabled),
      size: Number(candidate.grid?.size) > 0 ? Number(candidate.grid?.size) : 12,
      snap: Boolean(candidate.grid?.snap),
    },
    pages: [{ id: candidate.pages?.[0]?.id ?? 'page-1', elements: ensuredElements }],
  };
}
