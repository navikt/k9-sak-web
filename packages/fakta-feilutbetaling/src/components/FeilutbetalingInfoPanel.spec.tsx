import React from 'react';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import konsekvensForYtelsen from '@fpsak-frontend/kodeverk/src/konsekvensForYtelsen';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { utledKodeverkNavnFraKode } from '@k9-sak-web/lib/kodeverk/kodeverkUtils.js';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { screen } from '@testing-library/react';
import messages from '../../i18n/nb_NO.json';
import { FeilutbetalingInfoPanelImpl } from './FeilutbetalingInfoPanel';

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
  soknadType: soknadType.FODSEL,
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
      behandlingArsakType: behandlingArsakType.FEIL_I_LOVANDVENDELSE,
    },
  ],
  behandlingsresultat: {
    type: behandlingResultatType.INNVILGET,
    konsekvenserForYtelsen: [konsekvensForYtelsen.FORELDREPENGER_OPPHØRER, konsekvensForYtelsen.ENDRING_I_BEREGNING],
  },
  tilbakekrevingValg: {
    videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK,
  },
  datoForRevurderingsvedtak: '2019-01-01',
};

describe('<FeilutbetalingInfoPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverkV2);

    const kodeverkKlageNavnFraKode = vi
      .fn()
      .mockImplementation((kode, kodeverkType) => utledKodeverkNavnFraKode(kode, kodeverkType, alleKodeverkV2));
    const kodeverkTilbakekNavnFraKode = vi
      .fn()
      .mockImplementation((kode, kodeverkType) => utledKodeverkNavnFraKode(kode, kodeverkType, alleKodeverkV2));

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
        kodeverkTilbakekNavnFraKode={kodeverkTilbakekNavnFraKode}
        kodeverkKlageNavnFraKode={kodeverkKlageNavnFraKode}
      />,
      { messages },
    );

    expect(screen.getByText('01.01.2019 - 02.01.2019')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('Feil lovanvendelse')).toBeInTheDocument();
    expect(screen.getByText('01.01.2019')).toBeInTheDocument();
    expect(screen.getByText('Innvilget')).toBeInTheDocument();
    expect(screen.getByText('Foreldrepenger opphører, Endring i beregning')).toBeInTheDocument();
    expect(screen.getByText('Feilutbetaling hvor inntrekk dekker hele beløpet')).toBeInTheDocument();
  });
});
