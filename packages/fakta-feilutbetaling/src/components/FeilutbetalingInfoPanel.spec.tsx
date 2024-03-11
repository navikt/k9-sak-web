import React from 'react';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';

import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import messages from '../../i18n/nb_NO.json';
import { FeilutbetalingInfoPanelImpl } from './FeilutbetalingInfoPanel';

const BEHANDLING_AARSAK_KODEVERK = 'BEHANDLING_AARSAK';
const TILBAKEKR_VIDERE_BEH_KODEVERK = 'TILBAKEKR_VIDERE_BEH';
const BEHANDLING_RESULTAT_TYPE_KODEVERK = 'BEHANDLING_RESULTAT_TYPE';
const KONSEKVENS_FOR_YTELSEN_KODEVERK = 'KONSEKVENS_FOR_YTELSEN';

const feilutbetalingFakta = {
  behandlingFakta: {
    perioder: [
      {
        fom: '2018-01-01',
        tom: '2019-01-01',
      },
    ],
  },
  antallBarn: 1,
  soknadType: {
    kode: soknadType.FODSEL,
  },
  totalPeriodeFom: '2019-01-01',
  totalPeriodeTom: '2019-01-02',
  aktuellFeilUtbetaltBeløp: 10000,
  tidligereVarseltBeløp: 5000,
  perioder: [
    {
      fom: '2018-01-01',
      tom: '2019-01-01',
      belop: 1000,
    },
  ],
  behandlingÅrsaker: [
    {
      behandlingArsakType: {
        kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
        kodeverk: BEHANDLING_AARSAK_KODEVERK,
      },
    },
  ],
  behandlingsresultat: {
    type: {
      kode: behandlingResultatType.INNVILGET,
      kodeverk: BEHANDLING_RESULTAT_TYPE_KODEVERK,
    },
    konsekvenserForYtelsen: [
      {
        kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
        kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
      },
      {
        kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
        kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
      },
    ],
  },
  tilbakekrevingValg: {
    videreBehandling: {
      kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
      kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
    },
  },
  datoForRevurderingsvedtak: '2019-01-01',
};

const alleKodeverk = {
  [kodeverkTyper.TILBAKEKR_VIDERE_BEH]: [
    {
      kode: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
      navn: 'Tilbakekreving inntrekk',
      kodeverk: TILBAKEKR_VIDERE_BEH_KODEVERK,
    },
  ],
};

const fpsakKodeverk = {
  [kodeverkTyper.BEHANDLING_AARSAK]: [
    {
      kode: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
      navn: 'Feil i lovanvendelse',
      kodeverk: BEHANDLING_AARSAK_KODEVERK,
    },
  ],
  [kodeverkTyper.BEHANDLING_RESULTAT_TYPE]: [
    {
      kode: behandlingResultatType.INNVILGET,
      navn: 'Innvilget',
      kodeverk: BEHANDLING_RESULTAT_TYPE_KODEVERK,
    },
  ],
  [kodeverkTyper.KONSEKVENS_FOR_YTELSEN]: [
    {
      kode: konsekvensForYtelsen.FORELDREPENGER_OPPHØRER,
      navn: 'Foreldrepenger opphører',
      kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
    },
    {
      kode: konsekvensForYtelsen.ENDRING_I_BEREGNING,
      navn: 'Endring i beregning',
      kodeverk: KONSEKVENS_FOR_YTELSEN_KODEVERK,
    },
  ],
};

describe('<FeilutbetalingInfoPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntlAndReduxForm(
      <FeilutbetalingInfoPanelImpl
        {...reduxFormPropsMock}
        feilutbetaling={feilutbetalingFakta}
        intl={intlMock}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        readOnly={false}
        openInfoPanels={['feilutbetaling']}
        submitCallback={vi.fn()}
        årsaker={[]}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={alleKodeverk}
        fpsakKodeverk={fpsakKodeverk}
      />,
      { messages },
    );

    expect(screen.getByText('01.01.2019 - 02.01.2019')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('Feil i lovanvendelse')).toBeInTheDocument();
    expect(screen.getByText('01.01.2019')).toBeInTheDocument();
    expect(screen.getByText('Innvilget')).toBeInTheDocument();
    expect(screen.getByText('Foreldrepenger opphører, Endring i beregning')).toBeInTheDocument();
    expect(screen.getByText('Tilbakekreving inntrekk')).toBeInTheDocument();
  });
});
