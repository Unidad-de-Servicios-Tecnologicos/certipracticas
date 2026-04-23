export type DocumentType = 'C.C.' | 'T.I.' | 'C.E.';

export interface Intern {
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  documentCity: string;
  program: string;
}
