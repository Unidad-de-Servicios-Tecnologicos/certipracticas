export const APP_NAME = 'CertiPrácticas SENA';
export const APP_TAGLINE = 'Generador de Cartas para Etapa Productiva';

export const STORAGE_KEYS = {
  form: 'certipracticas.form',
  templates: 'certipracticas.templates',
  activeTemplate: 'certipracticas.activeTemplate',
  theme: 'certipracticas.theme',
} as const;

export const DOCUMENT_TYPES = [
  { value: 'C.C.', label: 'C.C. — Cédula de Ciudadanía' },
  { value: 'T.I.', label: 'T.I. — Tarjeta de Identidad' },
  { value: 'C.E.', label: 'C.E. — Cédula de Extranjería' },
  { value: 'P.A.', label: 'P.A. — Pasaporte' },
  { value: 'O.T.', label: 'O.T. — Otro' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'F', label: 'Femenino' },
  { value: 'M', label: 'Masculino' },
] as const;

export const MIC_SILENCE_MS = 3000;
