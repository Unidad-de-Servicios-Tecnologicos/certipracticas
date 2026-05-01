import type { Letter } from '@/types/letter';
import type { Gender } from '@/types/intern';
import type { Project } from '@/types/activities';
import { formatDateLong } from '@/utils/formatDate';

function val(value: string | undefined | null, fieldName: string): string {
  return value && value.trim() !== '' ? value : `[${fieldName}]`;
}

export interface GenderTerms {
  joven: string;
  identificado: string;
  practicante: string;
  expedida: string;
}

export function getGenderTerms(gender: Gender): GenderTerms {
  if (gender === 'M') {
    return {
      joven: 'el joven',
      identificado: 'identificado',
      practicante: 'el practicante',
      expedida: 'expedido',
    };
  }
  return {
    joven: 'la joven',
    identificado: 'identificada',
    practicante: 'la practicante',
    expedida: 'expedida',
  };
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
  const terms = getGenderTerms(intern.gender);

  return `Que, cumplidos ${val(period.duration, 'Duración')} desde el ${startLong} al ${endLong}, ${terms.joven} ${val(intern.fullName, 'Nombre completo')}, ${terms.identificado} con ${val(intern.documentType, 'Tipo de documento')}: ${val(intern.documentNumber, 'Número de documento')} ${terms.expedida} en ${val(intern.documentCity, 'Ciudad de expedición')}, finalizó su proceso de etapa productiva bajo la modalidad de ${val(period.modality, 'Modalidad')}, en el ${val(center.name, 'Nombre del centro')} donde desarrolló su práctica en la ${val(period.unit, 'Unidad')} en el área de ${val(period.area, 'Área')} como ${val(intern.program, 'Programa')} del ${val(center.name, 'Nombre del centro')}.`;
}

export function buildActivitiesIntro(letter: Letter): string {
  const terms = getGenderTerms(letter.intern.gender);
  return `Dentro de las actividades realizadas por ${terms.practicante} en la ${val(letter.period.area, 'Área')} se encuentran:`;
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
  const ext = instructor.extension?.trim() ? ` extensión ${instructor.extension.trim()}` : '';
  return `Instructor de etapa productiva: ${val(instructor.fullName, 'Nombre completo')} · Tel: ${val(instructor.phone, 'Teléfono')}${ext} · ${val(instructor.email, 'Email')}`;
}

export function formatProject(project: Project): string {
  const head = [project.code.trim(), project.name.trim()].filter(Boolean).join(' – ');
  return [head, project.description.trim()].filter(Boolean).join(': ');
}

export function buildDrafterLine(letter: Letter): string {
  return `Proyectó: ${val(letter.drafter.fullName, 'Nombre').trim()}. ${val(letter.drafter.role, 'Rol / cargo').trim()}`;
}

export function buildFooterLine(letter: Letter): string {
  const { center } = letter;
  return `${val(center.name, 'Nombre del centro')} · ${val(center.address, 'Dirección')} · PBX ${val(center.phone, 'Teléfono')} · ${val(center.documentCode, 'Código del documento')} ${val(center.documentVersion, 'Versión del documento')}`;
}
