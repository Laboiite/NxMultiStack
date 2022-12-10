import { render } from '@testing-library/react';

import ReactAppAShell from './react-app-a-shell';

describe('ReactAppAShell', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactAppAShell />);
    expect(baseElement).toBeTruthy();
  });
});
