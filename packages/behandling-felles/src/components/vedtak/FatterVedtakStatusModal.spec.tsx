import React from 'react';

import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import FatterVedtakStatusModal from './FatterVedtakStatusModal';

describe('<FatterVedtakStatusModal>', () => {
  const closeEventCallback = vi.fn();

  it('skal rendre modal for fatter vedtak', () => {
    renderWithIntl(
      <FatterVedtakStatusModal.WrappedComponent
        intl={intlMock}
        visModal
        tekstkode="FatterVedtakStatusModal.KlagenErFerdigbehandlet"
        lukkModal={closeEventCallback}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Klagen er ferdigbehandlet.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
