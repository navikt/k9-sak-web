import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakAksjonspunktPanelImpl } from './VedtakAksjonspunktPanel';

describe('<VedtakAksjonspunktPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    const aksjonspunktKoder = [];
    renderWithIntl(
      <VedtakAksjonspunktPanelImpl
        intl={intlMock}
        behandlingStatusKode={behandlingStatus.BEHANDLING_UTREDES}
        readOnly={false}
        aksjonspunktKoder={aksjonspunktKoder}
        isBehandlingReadOnly={false}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Vedtak' })).toBeInTheDocument();
  });
});
