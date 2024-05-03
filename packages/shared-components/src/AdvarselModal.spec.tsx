import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import AdvarselModal from './AdvarselModal';

describe('<AdvarselModal>', () => {
  it('skal rendre modal', () => {
    renderWithIntl(<AdvarselModal bodyText="Åpne behandling" showModal submit={vi.fn()} />);

    expect(screen.getByRole('dialog', { name: 'Åpne behandling' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
