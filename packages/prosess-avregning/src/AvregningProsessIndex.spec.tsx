import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Fagsak } from '@k9-sak-web/types';
import messages from '../i18n/nb_NO.json';
import AvregningProsessIndex from './AvregningProsessIndex';

describe('<AvregningProsessIndex>', () => {
  const fagsak: Fagsak = {
    saksnummer: '123',
    sakstype: fagsakYtelsesType.FP,
    relasjonsRolleType: '',
    status: 'OPPR',
    barnFodt: '',
    person: {
      erDod: false,
      navn: '',
      alder: 0,
      personnummer: '',
      erKvinne: false,
      personstatusType: '',
      diskresjonskode: '',
      dodsdato: '',
      aktørId: '',
    },
    opprettet: '',
    endret: '',
    antallBarn: 0,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 0,
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
