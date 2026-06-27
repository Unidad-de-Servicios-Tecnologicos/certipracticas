import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SidebarNav } from './SidebarNav';
import { useAppStore } from '@/store/useAppStore';
import { useFormStore } from '@/store/useFormStore';
import { sampleLetter } from '@/data/defaultLetter';

describe('SidebarNav', () => {
  it('renders section navigation', () => {
    useFormStore.setState({ letter: sampleLetter });
    useAppStore.setState({ activeSection: 'general' });
    render(<SidebarNav />);
    expect(screen.getByRole('navigation', { name: /Secciones del formulario/i })).toBeInTheDocument();
    expect(screen.getByText(/Información general/i)).toBeInTheDocument();
  });
});
