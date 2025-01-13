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
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    },
    fagsakYtelseType: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    },
  };

  const behandling = {
    id: 1,
    versjon: 1,
    sprakkode: {
      kode: 'NO',
      kodeverk: '',
    },
  };

  const aksjonspunkter = [
    {
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
        kodeverk: '',
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
