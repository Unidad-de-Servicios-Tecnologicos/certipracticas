import type { Letter } from '@/types/letter';
import { formatDateLong } from '@/utils/formatDate';

function val(value: string | undefined | null, fieldName: string): string {
  return value && value.trim() !== '' ? value : `[${fieldName}]`;
}

export function buildTitle(letter: Letter): string {
  return `CERTIFICACIÓN DE EJECUCIÓN DE ETAPA PRODUCTIVA EN EL ${val(letter.center.name, 'Nombre del centro').toUpperCase()}`;
}

export function buildSubtitle(letter: Letter): string {
  return `EL ${val(letter.signer.position, 'Cargo').toUpperCase()} DEL ${val(letter.center.name, 'Nombre del centro').toUpperCase()}, REGIONAL ${val(letter.center.regional, 'Regional').toUpperCase()} DEL SENA, HACE CONSTAR:`;
}

export function buildBodyParagraph(letter: Letter): string {
  const { intern, period, center } = letter;
  const startLong = val(formatDateLong(period.startDate), 'Fecha de inicio');
  const endLong = val(formatDateLong(period.endDate), 'Fecha fin');
  
  return `Que, cumplidos ${val(period.duration, 'Duración')} desde el ${startLong} al ${endLong}, la joven ${val(intern.fullName, 'Nombre completo')}, identificada con ${val(intern.documentType, 'Tipo de documento')}: ${val(intern.documentNumber, 'Número de documento')} expedida en ${val(intern.documentCity, 'Ciudad de expedición')}, finalizó su proceso de etapa productiva bajo la modalidad de ${val(period.modality, 'Modalidad')}, en el ${val(center.name, 'Nombre del centro')} donde desarrolló su práctica en la ${val(period.unit, 'Unidad')} en el área de ${val(period.area, 'Área')} como ${val(intern.program, 'Programa')} del ${val(center.name, 'Nombre del centro')}.`;
}

export function buildClassificationLabel(letter: Letter): string {
  if (!letter.metadata.classification) return '[Clasificación]';
  switch (letter.metadata.classification) {
    case 'public':
      return 'Pública';
    case 'classified':
      return 'Clasificada';
    case 'reserved':
      return 'Reservada';
    default:
      return '[Clasificación]';
  }
}

export function buildActivitiesIntro(letter: Letter): string {
  return `Dentro de las actividades realizadas por la practicante en ${val(letter.period.area, 'Área')} se encuentran:`;
}

export function buildStrengthsIntro(): string {
  return 'Demostró fortalezas Técnicas en:';
}

export function buildClosing(letter: Letter): string {
  const issue = val(formatDateLong(letter.metadata.issueDate), 'Fecha de expedición');
  return `Dado en ${val(letter.metadata.city, 'Ciudad')}, a los ${issue}.`;
}

export function buildInstructorLine(letter: Letter): string {
  const { instructor } = letter;
  return `Instructor de etapa productiva: ${val(instructor.fullName, 'Nombre completo')} · Tel: ${val(instructor.phone, 'Teléfono')} · ${val(instructor.email, 'Email')}`;
}

export function buildDrafterLine(letter: Letter): string {
  return `Proyectó: ${val(letter.drafter.fullName, 'Nombre').trim()}. ${val(letter.drafter.role, 'Rol / cargo').trim()}`;
}

export function buildFooterLine(letter: Letter): string {
  const { center } = letter;
  return `${val(center.name, 'Nombre del centro')} · ${val(center.address, 'Dirección')} · PBX ${val(center.phone, 'Teléfono')} · ${val(center.documentCode, 'Código del documento')} ${val(center.documentVersion, 'Versión del documento')}`;
}
