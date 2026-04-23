export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  voice?: boolean;
  tooltip?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date';
}

export const internFields: FieldDef[] = [
  { key: 'fullName', label: 'Nombre completo', placeholder: 'Isabela Zapata Galeano', required: true, voice: true },
  { key: 'documentNumber', label: 'Número de documento', placeholder: '1.033.649.611', required: true, voice: true },
  { key: 'documentCity', label: 'Ciudad de expedición', placeholder: 'Medellín', required: true, voice: true },
  { key: 'program', label: 'Programa de formación', placeholder: 'Técnica en Programación de Software', required: true, voice: true },
];

export const centerFields: FieldDef[] = [
  { key: 'name', label: 'Nombre del centro', required: true, voice: true },
  { key: 'regional', label: 'Regional', required: true, voice: true },
  { key: 'address', label: 'Dirección', required: true, voice: true },
  { key: 'phone', label: 'PBX / Teléfono', type: 'tel', required: true },
  { key: 'documentCode', label: 'Código de documento', placeholder: 'GD-F-011' },
  { key: 'documentVersion', label: 'Versión', placeholder: 'V.10' },
];

export const periodFields: FieldDef[] = [
  { key: 'duration', label: 'Duración', placeholder: 'seis meses', required: true, voice: true },
  { key: 'startDate', label: 'Fecha de inicio', type: 'date', required: true },
  { key: 'endDate', label: 'Fecha de fin', type: 'date', required: true },
  { key: 'modality', label: 'Modalidad', placeholder: 'contrato de aprendizaje', voice: true },
  { key: 'unit', label: 'Unidad', required: true, voice: true },
  { key: 'area', label: 'Área', required: true, voice: true },
];

export const instructorFields: FieldDef[] = [
  { key: 'fullName', label: 'Nombre completo', required: true, voice: true },
  { key: 'phone', label: 'Teléfono', type: 'tel', required: true },
  { key: 'email', label: 'Correo electrónico', type: 'email', required: true },
];

export const signerFields: FieldDef[] = [
  { key: 'fullName', label: 'Nombre completo', required: true, voice: true },
  { key: 'position', label: 'Cargo', required: true, voice: true },
];

export const drafterFields: FieldDef[] = [
  { key: 'fullName', label: 'Nombre completo', required: true, voice: true },
  { key: 'role', label: 'Rol / cargo', required: true, voice: true },
];

export const metadataFields: FieldDef[] = [
  { key: 'documentNumber', label: 'Número de documento', placeholder: '5 9402', required: true },
  { key: 'city', label: 'Ciudad', placeholder: 'Medellín', required: true, voice: true },
  { key: 'issueDate', label: 'Fecha de emisión', type: 'date', required: true },
];
