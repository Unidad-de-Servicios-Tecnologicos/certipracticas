import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { GeneralSection } from './GeneralSection';
import { useFormStore } from '@/store/useFormStore';
import { sampleLetter } from '@/data/defaultLetter';

describe('GeneralSection', () => {
  it('renders period fields', () => {
    useFormStore.setState({ letter: sampleLetter });
    render(<GeneralSection />);
    expect(screen.getByLabelText(/Fecha de inicio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fecha de fin/i)).toBeInTheDocument();
  });

  it('updates store on input change', async () => {
    useFormStore.setState({ letter: sampleLetter });
    const user = userEvent.setup();
    render(<GeneralSection />);
    const modality = screen.getByLabelText(/Modalidad/i);
    await user.clear(modality);
    await user.type(modality, 'prueba');
    expect(useFormStore.getState().letter.period.modality).toContain('prueba');
  });
});
