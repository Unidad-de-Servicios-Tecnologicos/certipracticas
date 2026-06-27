import { Textarea } from '@/components/ui/Textarea';
import { FormSectionShell } from './FormSectionShell';
import { useFormStore } from '@/store/useFormStore';

export function EvaluacionSection() {
  const letter = useFormStore((s) => s.letter);
  const setPerformanceReview = useFormStore((s) => s.setPerformanceReview);

  return (
    <FormSectionShell sectionId="evaluacion">
      <Textarea
        label="Evaluación de desempeño"
        value={letter.activities.performanceReview}
        onChange={(e) => setPerformanceReview(e.target.value)}
        rows={8}
        placeholder="Describe el desempeño del aprendiz durante la etapa productiva…"
      />
    </FormSectionShell>
  );
}
