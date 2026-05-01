export type SignatureMethod = 'drawn' | 'uploaded';
export type SignatureAlign = 'left' | 'center' | 'right';

export interface SignatureData {
  method: SignatureMethod;
  dataUrl: string;
  createdAt: string;
}

export interface SignatureLayout {
  xPct: number;
  yPct: number;
  scale: number;
  rotationDeg: number;
  align: SignatureAlign;
}
