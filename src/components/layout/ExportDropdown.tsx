import { useRef } from 'react';
import { FaFileExport, FaFileImport, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useExport } from '@/hooks/useExport';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { exportSchemaToJson, importSchemaFromJson } from '@/services/editorSchemaIO';
import { downloadBlob } from '@/utils/fileDownload';
import { notify } from '@/utils/toast';

export interface ExportDropdownProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport?: () => boolean;
}

export function ExportDropdown({ previewRef, onBeforeExport }: ExportDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { exportPDF, exportDOCX } = useExport();
  const isExporting = useAppStore((s) => s.isExporting);
  const documentSchema = useFormStore((s) => s.documentSchema);
  const setDocumentSchema = useFormStore((s) => s.setDocumentSchema);

  async function handleImport(file?: File) {
    if (!file) return;
    try {
      const content = await file.text();
      const schema = importSchemaFromJson(content);
      setDocumentSchema(schema);
      notify.success('Plantilla JSON importada correctamente.');
    } catch (error) {
      console.error(error);
      notify.error('No se pudo importar el archivo JSON.');
    }
  }

  function guardExport(fn: () => void) {
    if (onBeforeExport && !onBeforeExport()) return;
    fn();
  }

  return (
    <div className="relative flex items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => handleImport(e.target.files?.[0])}
      />
      <div className="group relative">
        <Button variant="secondary" size="sm" disabled={isExporting}>
          {isExporting ? <Spinner size="sm" /> : 'Exportar ▾'}
        </Button>
        <div className="invisible absolute right-0 top-full z-50 mt-1 min-w-44 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]"
            disabled={isExporting}
            onClick={() => guardExport(() => exportPDF(previewRef.current))}
          >
            <FaFilePdf /> PDF
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]"
            disabled={isExporting}
            onClick={() => guardExport(() => exportDOCX(previewRef.current))}
          >
            <FaFileWord /> DOCX
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]"
            onClick={() => {
              const json = exportSchemaToJson(documentSchema);
              downloadBlob(new Blob([json], { type: 'application/json' }), 'plantilla-carta.json');
              notify.success('Plantilla JSON descargada.');
            }}
          >
            <FaFileExport /> JSON
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--color-bg-tertiary)]"
            onClick={() => inputRef.current?.click()}
          >
            <FaFileImport /> Importar
          </button>
        </div>
      </div>
    </div>
  );
}
