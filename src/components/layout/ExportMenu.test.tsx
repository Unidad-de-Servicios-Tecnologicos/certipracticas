import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ExportMenu } from './ExportMenu';

vi.mock('@/hooks/useExport', () => ({
  useExport: () => ({ exportPDF: vi.fn(), exportDOCX: vi.fn() }),
}));

describe('ExportMenu', () => {
  it('opens menu on click and shows PDF option', async () => {
    const user = userEvent.setup();
    const ref = { current: null };
    render(<ExportMenu previewRef={ref} />);
    await user.click(screen.getByRole('button', { name: /Exportar/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /PDF/i })).toBeInTheDocument();
  });
});
