import { useFormStore } from '@/store/useFormStore';
import { generateContent } from '@/services/aiService';
import { parseProjectFromString } from '@/utils/parseProject';
import { notify } from '@/utils/toast';

export function useAiProjects() {
  const letter = useFormStore((s) => s.letter);
  const setTasks = useFormStore((s) => s.setTasks);

  async function handleGenerateProjects() {
    if (!letter.intern.program) {
      notify.info('Ingresa el programa de formación del aprendiz primero.');
      return;
    }
    const loadingId = notify.loading('Generando proyectos con IA…');
    try {
      const text = await generateContent({ programName: letter.intern.program, type: 'projects' });
      const projects = text
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map(parseProjectFromString);
      if (projects.length > 0) setTasks(projects);
      notify.dismiss(loadingId);
      notify.success(`${projects.length} proyectos generados correctamente.`);
    } catch (error: unknown) {
      notify.dismiss(loadingId);
      const msg = error instanceof Error ? error.message : 'Error al generar proyectos.';
      notify.error(msg);
    }
  }

  return { handleGenerateProjects };
}
