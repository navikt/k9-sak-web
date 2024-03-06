import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import AdvarselModal from './AdvarselModal';

describe('<AdvarselModal>', () => {
  it('skal rendre modal', () => {
    renderWithIntl(<AdvarselModal bodyText="Åpne behandling" showModal submit={sinon.spy()} />);

    expect(screen.getByRole('dialog', { name: 'Åpne behandling' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
