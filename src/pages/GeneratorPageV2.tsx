import { useRef, useState, useCallback, useEffect } from 'react';
import { AppShellV2 } from '@/components/layout/AppShellV2';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { MainContent } from '@/components/layout/MainContent';
import { PreviewPanel } from '@/components/layout/PreviewPanel';
import { MobileTabLayout } from '@/components/layout/MobileTabLayout';
import { MobileSectionCarousel } from '@/components/layout/MobileSectionCarousel';
import { LetterFormV2 } from '@/components/form/LetterFormV2';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ValidationSummary } from '@/components/preview/ValidationSummary';
import { CommandPalette } from '@/components/command/CommandPalette';
import { ShortcutsPanel } from '@/components/shortcuts/ShortcutsPanel';
import { OnboardingTour, useOnboarding } from '@/components/onboarding/OnboardingTour';
import { StartChoiceModal, useStartChoice } from '@/components/onboarding/StartChoiceModal';
import { useFormProgress } from '@/hooks/useFormProgress';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useExport } from '@/hooks/useExport';
import { useAppStore } from '@/store/useAppStore';
import { isValidLetter } from '@/services/validators';
import { useFormStore } from '@/store/useFormStore';
import { notify } from '@/utils/toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function GeneratorPageV2() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [validationOpen, setValidationOpen] = useState(false);
  const pendingExport = useRef<(() => void) | null>(null);

  const commandPaletteOpen = useAppStore((s) => s.commandPaletteOpen);
  const setCommandPaletteOpen = useAppStore((s) => s.setCommandPaletteOpen);
  const shortcutsPanelOpen = useAppStore((s) => s.shortcutsPanelOpen);
  const setShortcutsOpen = useAppStore((s) => s.setShortcutsPanelOpen);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed);
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  useEffect(() => {
    setSidebarCollapsed(isTablet);
  }, [isTablet, setSidebarCollapsed]);

  const letter = useFormStore((s) => s.letter);
  const { exportPDF, exportDOCX } = useExport();
  const { percentage, pendingCount, errorCount, errors, firstErrorSection, sections } =
    useFormProgress();
  const completedCount = sections.filter((s) => s.complete).length;
  const { showOnboarding, completeOnboarding } = useOnboarding();
  const { showStartChoice, dismissStartChoice } = useStartChoice();

  const guardExport = useCallback(
    (fn: () => void) => {
      if (isValidLetter(letter)) {
        fn();
        return true;
      }
      pendingExport.current = fn;
      setValidationOpen(true);
      return false;
    },
    [letter]
  );

  useKeyboardShortcuts({
    onSave: () => notify.success('Documento guardado.'),
    onExportPDF: () => guardExport(() => exportPDF(previewRef.current)),
  });

  function handleBeforeExport() {
    return guardExport(() => {});
  }

  function handleForceExport() {
    setValidationOpen(false);
    pendingExport.current?.();
    pendingExport.current = null;
  }

  function handleOpenSettings() {
    setActiveSection('configuracion');
  }

  const formBlock = (
    <>
      <MainContent>
        <LetterFormV2 />
      </MainContent>
      <MobileSectionCarousel />
    </>
  );

  const previewBlock = <PreviewPanel previewRef={previewRef} />;

  return (
    <AppShellV2 previewRef={previewRef} onBeforeExport={handleBeforeExport} onOpenSettings={handleOpenSettings}>
      <div className="hidden h-full flex-col lg:flex">
        <div className="lg:hidden">
          <ProgressBar
            percentage={percentage}
            pendingCount={pendingCount}
            completedCount={completedCount}
            errorCount={errorCount}
            onErrorClick={() => firstErrorSection && setActiveSection(firstErrorSection)}
            className="border-b border-[var(--color-border)] px-4 py-2"
          />
        </div>
        <div className="flex min-h-0 flex-1">
          <SidebarNav collapsed={sidebarCollapsed} />
          <div className="min-w-0 flex-1">{formBlock}</div>
          <div className="hidden min-w-0 flex-1 lg:flex lg:max-w-[50%]">{previewBlock}</div>
        </div>
      </div>

      <div className="flex h-full flex-col lg:hidden">
        <ProgressBar
          percentage={percentage}
          pendingCount={pendingCount}
          completedCount={completedCount}
          errorCount={errorCount}
          onErrorClick={() => firstErrorSection && setActiveSection(firstErrorSection)}
          className="shrink-0 border-b border-[var(--color-border)] px-4 py-2"
        />
        <MobileTabLayout formContent={formBlock} previewContent={previewBlock} />
      </div>

      <ValidationSummary
        open={validationOpen}
        errors={errors}
        onClose={() => setValidationOpen(false)}
        onForceExport={handleForceExport}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onExportPDF={() => guardExport(() => exportPDF(previewRef.current))}
        onExportDOCX={() => guardExport(() => exportDOCX(previewRef.current))}
      />

      <ShortcutsPanel open={shortcutsPanelOpen} onClose={() => setShortcutsOpen(false)} />

      <OnboardingTour open={showOnboarding && !showStartChoice} onComplete={completeOnboarding} />

      <StartChoiceModal
        open={showStartChoice}
        onClose={dismissStartChoice}
      />
    </AppShellV2>
  );
}
