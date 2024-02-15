import React from 'react';
import { render, screen } from '@testing-library/react';
import TableColumn from './TableColumn';

describe('<TableColumn>', () => {
  it('skal vise  verdi i kolonne', () => {
    render(<TableColumn>testverdi</TableColumn>);
    expect(screen.getByText('testverdi')).toBeInTheDocument();
  });
});
