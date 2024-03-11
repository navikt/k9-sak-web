import React from 'react';

import { render, screen } from '@testing-library/react';
import TableColumn from './TableColumn';
import TableRow from './TableRow';

describe('<TableRow>', () => {
  it('skal lage en rad og rendre children inne denne', () => {
    const mouseEventFunction = vi.fn();
    const keyEventFunction = vi.fn();
    render(
      <TableRow id={1} onMouseDown={mouseEventFunction} onKeyDown={keyEventFunction}>
        <TableColumn>{1}</TableColumn>
      </TableRow>,
    );

    expect(screen.getByText(1)).toBeInTheDocument();
  });
});
