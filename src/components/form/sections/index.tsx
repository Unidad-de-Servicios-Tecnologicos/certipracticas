import type { FormSectionId } from '@/types/formSection';
import { GeneralSection } from './GeneralSection';
import { EmpresaSection } from './EmpresaSection';
import { AprendizSection } from './AprendizSection';
import { SupervisorSection } from './SupervisorSection';
import { ActividadesSection } from './ActividadesSection';
import { FortalezasSection } from './FortalezasSection';
import { EvaluacionSection } from './EvaluacionSection';
import { FirmaSection } from './FirmaSection';
import { LogosSection } from './LogosSection';
import { IaSection } from './IaSection';
import { ConfiguracionSection } from './ConfiguracionSection';

export function SectionFields({ sectionId }: { sectionId: FormSectionId }) {
  switch (sectionId) {
    case 'general':
      return <GeneralSection />;
    case 'empresa':
      return <EmpresaSection />;
    case 'aprendiz':
      return <AprendizSection />;
    case 'supervisor':
      return <SupervisorSection />;
    case 'actividades':
      return <ActividadesSection />;
    case 'fortalezas':
      return <FortalezasSection />;
    case 'evaluacion':
      return <EvaluacionSection />;
    case 'firma':
      return <FirmaSection />;
    case 'logos':
      return <LogosSection />;
    case 'ia':
      return <IaSection />;
    case 'configuracion':
      return <ConfiguracionSection />;
    default:
      return null;
  }
}
