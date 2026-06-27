import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

const ONBOARDING_KEY = 'certipracticas-onboarding-v1';

const STEPS = [
  {
    title: 'Completa el formulario por secciones',
    body: 'Usa la barra lateral para navegar entre secciones. Cada una agrupa campos relacionados.',
  },
  {
    title: 'Genera contenido con IA',
    body: 'En Actividades o la sección IA, genera proyectos sugeridos según el programa del aprendiz.',
  },
  {
    title: 'Exporta tu documento',
    body: 'Usa Exportar en el header para descargar PDF, DOCX o JSON cuando termines.',
  },
  {
    title: 'Personaliza el documento',
    body: 'Edita bloques en la vista previa, agrega logos y firma digital desde las secciones correspondientes.',
  },
];

export function useOnboarding() {
  const [show, setShow] = useState(() => {
    try {
      return localStorage.getItem(ONBOARDING_KEY) !== 'done';
    } catch {
      return false;
    }
  });

  function complete() {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'done');
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  function relaunch() {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {
      /* ignore */
    }
    setShow(true);
  }

  return { showOnboarding: show, completeOnboarding: complete, dismissOnboarding: complete, relaunchOnboarding: relaunch };
}

export function resetOnboarding() {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch {
    /* ignore */
  }
}

export interface OnboardingTourProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ open, onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleSkip() {
    setStep(0);
    onComplete();
  }

  function handleNext() {
    if (isLast) {
      setStep(0);
      onComplete();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <Modal open={open} onClose={handleSkip} title={`Bienvenido a CertiPrácticas (${step + 1}/${STEPS.length})`}>
      <div className="flex gap-1 mb-4">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}
          />
        ))}
      </div>
      <h3 className="mb-2 font-semibold">{current.title}</h3>
      <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{current.body}</p>
      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleSkip}>
          Omitir
        </Button>
        <Button onClick={handleNext}>{isLast ? 'Comenzar' : 'Siguiente →'}</Button>
      </div>
    </Modal>
  );
}
