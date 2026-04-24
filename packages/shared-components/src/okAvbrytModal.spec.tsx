import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import OkAvbrytModal from './OkAvbrytModal';

describe('<OkAvbrytModal>', () => {
  it('skal rendre modal', () => {
    renderWithIntl(
      <OkAvbrytModal
        textCode="OkAvbrytModal.Ok"
        showModal
        cancel={vi.fn()}
        submit={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
