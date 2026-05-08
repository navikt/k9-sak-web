import React from 'react';

import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import FatterVedtakStatusModal from './FatterVedtakStatusModal';

describe('<FatterVedtakStatusModal>', () => {
  const closeEventCallback = vi.fn();

  it('skal rendre modal for fatter vedtak', () => {
    renderWithIntl(
      <FatterVedtakStatusModal
        visModal
        tekstkode="FatterVedtakStatusModal.KlagenErFerdigbehandlet"
        lukkModal={closeEventCallback}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Klagen er ferdigbehandlet.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
