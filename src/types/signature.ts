export type SignatureMethod = 'drawn' | 'uploaded';

export interface SignatureData {
  method: SignatureMethod;
  dataUrl: string;
  createdAt: string;
}
