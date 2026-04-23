export type DocumentType = 'C.C.' | 'T.I.' | 'C.E.';

export type Gender = 'F' | 'M';

export interface Intern {
  fullName: string;
  gender: Gender;
  documentType: DocumentType;
  documentNumber: string;
  documentCity: string;
  program: string;
}
