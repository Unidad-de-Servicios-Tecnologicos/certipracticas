import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResizablePanels } from './ResizablePanels';

describe('ResizablePanels', () => {
  it('renders left and right panels', () => {
    const { getByText } = render(
      <ResizablePanels left={<div>Form panel</div>} right={<div>Preview panel</div>} />
    );
    expect(getByText('Form panel')).toBeInTheDocument();
    expect(getByText('Preview panel')).toBeInTheDocument();
  });
});
