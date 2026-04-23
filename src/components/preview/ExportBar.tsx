import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useExport } from '@/hooks/useExport';
import { useAppStore } from '@/store/useAppStore';
import { ZoomControl } from './ZoomControl';

export interface ExportBarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportBar({ previewRef }: ExportBarProps) {
  const { exportPDF, exportDOCX } = useExport();
  const isExporting = useAppStore((s) => s.isExporting);

  return (
    <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
      <ZoomControl />
      <div className="flex gap-2">
        <Button
          onClick={() => exportDOCX()}
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
