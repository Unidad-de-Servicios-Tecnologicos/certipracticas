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
    address: 'Calle 51 Nº 57-70, Medellín-Antioquia',
    phone: '57 604 5760000',
    documentCode: 'GD-F-011',
    documentVersion: 'V.08',
  },
  period: {
    duration: 'seis meses',
    startDate: sixMonthsAgoISO(),
    endDate: todayISO(),
    modality: 'Contrato de aprendizaje',
    unit: '',
    area: 'Tecnoparque Nodo Medellín',
  },
  activities: {
    tasks: [{ code: '', name: '', description: '' }],
    technicalStrengths: [''],
    performanceReview: '',
  },
  instructor: {
    fullName: '',
    phone: '',
    extension: '',
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
    documentNumber: '',
    city: 'Medellín',
    issueDate: todayISO(),
    classification: 'public',
  },
};

export const sampleLetter: Letter = {
  intern: {
    fullName: 'Michael Santiago Morales Alvarez',
    gender: 'M',
    documentType: 'C.C.',
    documentNumber: '1,013,337,225',
    documentCity: 'Medellín Antioquia',
    program: 'Tecnología en Análisis y Desarrollo de Sistemas de Información',
  },
  center: {
    name: 'Centro de Servicios y Gestión Empresarial',
    regional: 'Antioquia',
    address: 'Calle 51 Nº 57-70, Medellín-Antioquia',
    phone: '57 604 5760000',
    documentCode: 'GD-F-011',
    documentVersion: 'V.08',
  },
  period: {
    duration: 'seis meses',
    startDate: '2023-07-17',
    endDate: '2024-01-16',
    modality: 'Contrato de aprendizaje',
    unit: '',
    area: 'Tecnoparque Nodo Medellín',
  },
  activities: {
    tasks: [
      {
        code: 'P2023-014296-13274',
        name: 'StampArt',
        description: 'Plataforma e-commerce para la venta de camisas con estampados personalizados, que permita la personalización de las prendas.',
      },
      {
        code: 'P2023-014296-13187',
        name: 'Plataforma Integral para la Gestión de Residuos Sólidos Aprovechables – PIRSA',
        description: 'Plataforma web con acceso a dispositivos móviles que integre a los tres actores principales que intervienen en la gestión de residuos sólidos aprovechables: Generador - Recolector y Transformador, utilizando la tecnología como medio facilitador para alcanzar una acertada logística y gestión en la recolección, almacenamiento, tratamiento y aprovechamiento de los residuos sólidos aprovechables.',
      },
    ],
    technicalStrengths: [''],
    performanceReview: '',
  },
  instructor: {
    fullName: 'Jorge Bolaños González',
    phone: '6045760000',
    extension: '42253',
    email: 'jybolanos@sena.edu.co',
  },
  signer: {
    fullName: 'Jorge Hernán Vélez Gallego',
    position: 'Subdirector (E)',
  },
  drafter: {
    fullName: 'Jorge Yimy Bolaños González',
    role: 'Experto Tecnologías Virtuales Tecnoparque',
  },
  metadata: {
    documentNumber: '59402',
    city: 'Medellín',
    issueDate: '2024-02-13',
    classification: 'public',
  },
};
