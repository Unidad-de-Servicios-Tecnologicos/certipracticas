import { useRef } from 'react';
import { FaFileExport, FaFileImport, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useExport } from '@/hooks/useExport';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { ZoomControl } from './ZoomControl';
import { BlockStyleBar } from '@/components/editor/BlockStyleBar';
import { exportSchemaToJson, importSchemaFromJson } from '@/services/editorSchemaIO';
import { downloadBlob } from '@/utils/fileDownload';
import { notify } from '@/utils/toast';

export interface ExportBarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportBar({ previewRef }: ExportBarProps) {
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
      notify.success('Plantilla JSON cargada correctamente.');
    } catch (error) {
      console.error(error);
      notify.error('No se pudo importar el JSON de plantilla.');
    }
  }

  return (
    <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
      <ZoomControl />
      <BlockStyleBar />
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => handleImport(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            const json = exportSchemaToJson(documentSchema);
            downloadBlob(new Blob([json], { type: 'application/json' }), 'plantilla-carta.json');
          }}
          leftIcon={<FaFileExport />}
        >
          JSON
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          leftIcon={<FaFileImport />}
        >
          Importar
        </Button>
        <Button
          onClick={() => exportDOCX(previewRef.current)}
          disabled={isExporting}
          leftIcon={isExporting ? <Spinner size="sm" /> : <FaFileWord />}
        >
          DOCX
        </Button>
        <Button
          variant="secondary"
          onClick={() => exportPDF(previewRef.current)}
          disabled={isExporting}
          leftIcon={isExporting ? <Spinner size="sm" /> : <FaFilePdf />}
        >
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
