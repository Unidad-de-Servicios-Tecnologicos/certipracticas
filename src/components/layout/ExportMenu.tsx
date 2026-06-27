import { useRef } from 'react';
import { FaFileExport, FaFileImport, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { Spinner } from '@/components/ui/Spinner';
import { useExport } from '@/hooks/useExport';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { exportSchemaToJson, importSchemaFromJson } from '@/services/editorSchemaIO';
import { downloadBlob } from '@/utils/fileDownload';
import { notify } from '@/utils/toast';

export interface ExportMenuProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport?: () => boolean;
}

export function ExportMenu({ previewRef, onBeforeExport }: ExportMenuProps) {
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
      <Dropdown
        trigger={({ id, expanded, onToggle }) => (
          <Button
            id={id}
            variant="secondary"
            size="sm"
            disabled={isExporting}
            aria-haspopup="menu"
            aria-expanded={expanded}
            onClick={onToggle}
          >
            {isExporting ? <Spinner size="sm" /> : 'Exportar ▾'}
          </Button>
        )}
      >
        <DropdownItem
          icon={<FaFilePdf />}
          disabled={isExporting}
          onClick={() => guardExport(() => exportPDF(previewRef.current))}
        >
          PDF
        </DropdownItem>
        <DropdownItem
          icon={<FaFileWord />}
          disabled={isExporting}
          onClick={() => guardExport(() => exportDOCX(previewRef.current))}
        >
          DOCX
        </DropdownItem>
        <DropdownItem
          icon={<FaFileExport />}
          onClick={() => {
            const json = exportSchemaToJson(documentSchema);
            downloadBlob(new Blob([json], { type: 'application/json' }), 'plantilla-carta.json');
            notify.success('Plantilla JSON descargada.');
          }}
        >
          JSON
        </DropdownItem>
        <DropdownItem icon={<FaFileImport />} onClick={() => inputRef.current?.click()}>
          Importar
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
