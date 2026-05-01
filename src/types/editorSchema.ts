export type PageSize = 'a4' | 'carta';
export type SectionType = 'header' | 'body' | 'footer';
export type ElementType = 'logo' | 'text';
export type HorizontalAlign = 'left' | 'center' | 'right';

export interface EditorGridConfig {
  enabled: boolean;
  size: number;
  snap: boolean;
}

export interface BaseElementNode {
  id: string;
  type: ElementType;
  section: SectionType;
  xPct: number;
  yPct: number;
  widthPx: number;
  heightPx: number;
  rotationDeg: number;
  opacity: number;
  align: HorizontalAlign;
  zIndex: number;
  locked: boolean;
}

export interface LogoNode extends BaseElementNode {
  type: 'logo';
  src: string;
  name: string;
}

export interface TextNode extends BaseElementNode {
  type: 'text';
  text: string;
}

export type ElementNode = LogoNode | TextNode;

export interface PageSchema {
  id: string;
  elements: ElementNode[];
}

export interface DocumentSchema {
  version: 1;
  pageSize: PageSize;
  grid: EditorGridConfig;
  pages: PageSchema[];
}
