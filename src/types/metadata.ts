export type Classification = 'public' | 'classified' | 'reserved';

export interface LetterMetadata {
  documentNumber: string;
  city: string;
  issueDate: string;
  classification: Classification;
}
