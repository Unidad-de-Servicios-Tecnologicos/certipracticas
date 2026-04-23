import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders label and forwards changes', () => {
    const onChange = vi.fn();
    render(<Input label="Nombre" name="nombre" value="" onChange={onChange} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Input label="F" value="" onChange={() => {}} error="requerido" />);
    expect(screen.getByText('requerido')).toBeInTheDocument();
  });
});
