import type { IconType } from 'react-icons';
import {
  FaBuilding,
  FaCog,
  FaFileAlt,
  FaListUl,
  FaMagic,
  FaPen,
  FaSignature,
  FaStar,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import type { FormSectionId } from '@/types/formSection';
import { FORM_SECTION_ORDER } from '@/types/formSection';

export interface FormSectionConfig {
  id: FormSectionId;
  label: string;
  description: string;
  icon: IconType;
  errorKeys: string[];
}

export const FORM_SECTIONS: FormSectionConfig[] = [
  {
    id: 'general',
    label: 'Información general',
    description: 'Período de práctica y datos del documento.',
    icon: FaFileAlt,
    errorKeys: ['period.startDate', 'period.endDate', 'metadata.documentNumber', 'metadata.issueDate'],
  },
  {
    id: 'empresa',
    label: 'Empresa',
    description: 'Centro de formación donde se realizó la etapa productiva.',
    icon: FaBuilding,
    errorKeys: ['center.name', 'center.regional'],
  },
  {
    id: 'aprendiz',
    label: 'Aprendiz',
    description: 'Datos personales y programa de formación del practicante.',
    icon: FaUser,
    errorKeys: ['intern.fullName', 'intern.documentNumber', 'intern.documentCity', 'intern.program'],
  },
  {
    id: 'supervisor',
    label: 'Supervisor',
    description: 'Experto de contacto, firmante y quien proyectó el documento.',
    icon: FaUserTie,
    errorKeys: ['instructor.fullName', 'instructor.email', 'signer.fullName', 'signer.position'],
  },
  {
    id: 'actividades',
    label: 'Actividades',
    description: 'Proyectos y actividades desarrolladas durante la etapa productiva.',
    icon: FaListUl,
    errorKeys: ['activities.tasks'],
  },
  {
    id: 'fortalezas',
    label: 'Fortalezas',
    description: 'Competencias técnicas demostradas por el aprendiz.',
    icon: FaStar,
    errorKeys: [],
  },
  {
    id: 'evaluacion',
    label: 'Evaluación',
    description: 'Evaluación del desempeño durante la etapa productiva.',
    icon: FaPen,
    errorKeys: [],
  },
  {
    id: 'firma',
    label: 'Firma',
    description: 'Firma digital de quien proyectó el documento.',
    icon: FaSignature,
    errorKeys: [],
  },
  {
    id: 'logos',
    label: 'Logos',
    description: 'Logos institucionales en el documento.',
    icon: FaBuilding,
    errorKeys: [],
  },
  {
    id: 'ia',
    label: 'IA',
    description: 'Generación asistida de contenido con inteligencia artificial.',
    icon: FaMagic,
    errorKeys: [],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    description: 'Opciones del documento y acciones generales.',
    icon: FaCog,
    errorKeys: [],
  },
];

export function getSectionIndex(id: FormSectionId): number {
  return FORM_SECTION_ORDER.indexOf(id);
}

export function getNextSection(id: FormSectionId): FormSectionId | null {
  const idx = getSectionIndex(id);
  return idx < FORM_SECTION_ORDER.length - 1 ? FORM_SECTION_ORDER[idx + 1] : null;
}

export function getPrevSection(id: FormSectionId): FormSectionId | null {
  const idx = getSectionIndex(id);
  return idx > 0 ? FORM_SECTION_ORDER[idx - 1] : null;
}

export function getSectionConfig(id: FormSectionId): FormSectionConfig {
  return FORM_SECTIONS.find((s) => s.id === id) ?? FORM_SECTIONS[0];
}
