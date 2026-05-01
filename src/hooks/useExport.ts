import { useCallback } from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useAppStore } from '@/store/useAppStore';
import { exportLetterAsPDF } from '@/services/pdfExporter';
import { exportLetterAsDOCX } from '@/services/docxExporter';
import { notify } from '@/utils/toast';

export function useExport() {
  const letter = useFormStore((s) => s.letter);
  const signature = useFormStore((s) => s.signature);
  const signatureLayout = useFormStore((s) => s.signatureLayout);
  const documentSchema = useFormStore((s) => s.documentSchema);
  const textOverrides = useFormStore((s) => s.textOverrides);
  const setExporting = useAppStore((s) => s.setExporting);

  const exportPDF = useCallback(
    async (previewElement: HTMLElement | null) => {
      if (!previewElement) {
        notify.error('No se encontró la vista previa para exportar.');
        return;
      }
      setExporting(true);
      const loadingId = notify.loading('Exportando PDF…');
      try {
        await exportLetterAsPDF(previewElement, letter, {
          signature,
          signatureLayout,
          documentSchema,
          textOverrides,
        });
        notify.dismiss(loadingId);
        notify.success('PDF exportado correctamente.');
      } catch (err) {
        console.error(err);
        notify.dismiss(loadingId);
        notify.error('Error al exportar PDF.');
      } finally {
        setExporting(false);
      }
    },
    [letter, setExporting, signature, signatureLayout, documentSchema, textOverrides]
  );

  const exportDOCX = useCallback(async (previewElement: HTMLElement | null) => {
    if (!previewElement) {
      notify.error('No se encontró la vista previa para exportar.');
      return;
    }
    setExporting(true);
    const loadingId = notify.loading('Exportando DOCX…');
    try {
      await exportLetterAsDOCX(letter, {
        signature,
        signatureLayout,
        documentSchema,
        textOverrides,
      });
      notify.dismiss(loadingId);
      notify.success('DOCX exportado correctamente.');
    } catch (err) {
      console.error(err);
      notify.dismiss(loadingId);
      notify.error('Error al exportar DOCX.');
    } finally {
      setExporting(false);
    }
  }, [letter, setExporting, signature, signatureLayout, documentSchema, textOverrides]);

  return { exportPDF, exportDOCX };
}
