import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Home from './Home';

describe('<Home>', () => {
  it('skal rendre komponent', async () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Home headerHeight={48} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Beklager, vi finner ikke siden du leter etter.')).toBeInTheDocument();
  });
});
