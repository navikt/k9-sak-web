import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import AvregningProsessIndex from './AvregningProsessIndex';

describe('<AvregningProsessIndex>', () => {
  const fagsak = {
    saksnummer: '123',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    fagsakYtelseType: fagsakYtelseType.FORELDREPENGER,
  };

  const behandling = {
    id: 1,
    versjon: 1,
    sprakkode: 'NO',
  };

  const aksjonspunkter = [
    {
      definisjon: aksjonspunktCodes.VURDER_FEILUTBETALING,
      begrunnelse: 'test',
    },
  ];

  it('skal rendre komponent korrekt', () => {
    renderWithIntlAndReduxForm(
      <AvregningProsessIndex
        fagsak={fagsak}
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        submitCallback={vi.fn()}
        isReadOnly={false}
        readOnlySubmitButton={false}
        isAksjonspunktOpen
        previewFptilbakeCallback={vi.fn()}
        featureToggles={{}}
      />,
      { messages },
    );
    expect(screen.getByRole('heading', { name: 'Simulering' })).toBeInTheDocument();
  });
});
