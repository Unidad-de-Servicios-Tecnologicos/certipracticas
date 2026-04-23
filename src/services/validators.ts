import type { Letter } from '@/types/letter';
import { parseISODate } from '@/utils/formatDate';

export type ValidationErrors = Record<string, string>;

export function validateLetter(letter: Letter): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!letter.intern.fullName.trim()) errors['intern.fullName'] = 'Nombre requerido';
  if (!letter.intern.documentNumber.trim())
    errors['intern.documentNumber'] = 'Documento requerido';
  if (!letter.intern.documentCity.trim())
    errors['intern.documentCity'] = 'Ciudad de expedición requerida';
  if (!letter.intern.program.trim()) errors['intern.program'] = 'Programa requerido';

  if (!letter.center.name.trim()) errors['center.name'] = 'Nombre del centro requerido';
  if (!letter.center.regional.trim()) errors['center.regional'] = 'Regional requerida';

  if (!letter.period.startDate) errors['period.startDate'] = 'Fecha de inicio requerida';
  if (!letter.period.endDate) errors['period.endDate'] = 'Fecha de fin requerida';

  const start = parseISODate(letter.period.startDate);
  const end = parseISODate(letter.period.endDate);
  if (start && end && end <= start) {
    errors['period.endDate'] = 'La fecha de fin debe ser posterior al inicio';
  }

  const tasks = letter.activities.tasks.filter((t) => t.trim().length > 0);
  if (tasks.length === 0) errors['activities.tasks'] = 'Agrega al menos 1 actividad';

  const strengths = letter.activities.technicalStrengths.filter((s) => s.trim().length > 0);
  if (strengths.length === 0)
    errors['activities.technicalStrengths'] = 'Agrega al menos 1 fortaleza técnica';

  if (!letter.activities.performanceReview.trim())
    errors['activities.performanceReview'] = 'Evaluación requerida';

  if (!letter.instructor.fullName.trim()) errors['instructor.fullName'] = 'Nombre requerido';
  if (letter.instructor.email && !/^\S+@\S+\.\S+$/.test(letter.instructor.email)) {
    errors['instructor.email'] = 'Correo inválido';
  }

  if (!letter.signer.fullName.trim()) errors['signer.fullName'] = 'Nombre del firmante requerido';
  if (!letter.signer.position.trim()) errors['signer.position'] = 'Cargo requerido';

  if (!letter.metadata.documentNumber.trim())
    errors['metadata.documentNumber'] = 'Número de documento requerido';
  if (!letter.metadata.issueDate) errors['metadata.issueDate'] = 'Fecha de emisión requerida';

  return errors;
}

export function isValidLetter(letter: Letter): boolean {
  return Object.keys(validateLetter(letter)).length === 0;
}

export function isEmailValid(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}
