import type { Letter } from '@/types/letter';
import { todayISO, sixMonthsAgoISO } from '@/utils/formatDate';

export const emptyLetter: Letter = {
  intern: {
    fullName: '',
    gender: 'F',
    documentType: 'C.C.',
    documentNumber: '',
    documentCity: '',
    program: '',
  },
  center: {
    name: 'Centro de Servicios y Gestión Empresarial',
    regional: 'Antioquia',
    address: 'calle 51, 57-70, Ciudad Medellín',
    phone: '57 601 5461500',
    documentCode: 'GD-F-011',
    documentVersion: 'V.10',
  },
  period: {
    duration: 'seis meses',
    startDate: sixMonthsAgoISO(),
    endDate: todayISO(),
    modality: 'contrato de aprendizaje',
    unit: 'Línea TICs e Inteligencia Artificial',
    area: 'Tecnoparque Medellín',
  },
  activities: {
    tasks: [''],
    technicalStrengths: [''],
    performanceReview: '',
  },
  instructor: {
    fullName: '',
    phone: '',
    email: '',
  },
  signer: {
    fullName: '',
    position: '',
  },
  drafter: {
    fullName: '',
    role: '',
  },
  metadata: {
    documentNumber: '5 9402',
    city: 'Medellín',
    issueDate: todayISO(),
    classification: 'public',
  },
};

export const sampleLetter: Letter = {
  intern: {
    fullName: 'Isabela Zapata Galeano',
    gender: 'F',
    documentType: 'C.C.',
    documentNumber: '1.033.649.611',
    documentCity: 'Medellín',
    program: 'Técnica en Programación de Software',
  },
  center: {
    name: 'Centro de Servicios y Gestión Empresarial',
    regional: 'Antioquia',
    address: 'calle 51, 57-70, Ciudad Medellín',
    phone: '57 601 5461500',
    documentCode: 'GD-F-011',
    documentVersion: 'V.10',
  },
  period: {
    duration: 'seis meses',
    startDate: sixMonthsAgoISO(),
    endDate: todayISO(),
    modality: 'contrato de aprendizaje',
    unit: 'Línea TICs e Inteligencia Artificial',
    area: 'Tecnoparque Medellín',
  },
  activities: {
    tasks: [
      'Especificar requisitos funcionales del sistema.',
      'Construir el sistema de información bajo las especificaciones establecidas.',
    ],
    technicalStrengths: ['React', 'Node.js'],
    performanceReview:
      'La practicante demostró un excelente desempeño, compromiso y proactividad durante toda su etapa productiva.',
  },
  instructor: {
    fullName: 'Nelson Rafael Canino',
    phone: '3028059920',
    email: 'ncanino@sena.edu.co',
  },
  signer: {
    fullName: 'AQUILINO MANUEL CUELLO BRITTO',
    position: 'Subdirector (e)',
  },
  drafter: {
    fullName: 'Jorge Yimmy Bolaños Gonzalez',
    role: 'Responsable de la Unidad de Servicios Tecnológicos',
  },
  metadata: {
    documentNumber: '5 9402',
    city: 'Medellín',
    issueDate: '2025-12-02',
    classification: 'public',
  },
};
