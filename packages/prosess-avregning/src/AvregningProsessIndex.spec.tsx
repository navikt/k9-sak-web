import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import AvregningProsessIndex from './AvregningProsessIndex';

describe('<AvregningProsessIndex>', () => {
  const fagsak = {
    saksnummer: '123',
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
    },
    fagsakYtelseType: {
      kode: fagsakYtelseType.FORELDREPENGER,
    },
  };

  const behandling = {
    id: 1,
    versjon: 1,
    sprakkode: {
      kode: 'NO',
    },
  };

  const aksjonspunkter = [
    {
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
      },
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
