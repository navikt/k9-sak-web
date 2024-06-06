import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';
import messages from '../../i18n/nb_NO.json';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';
import TilbakekrevingVedtak from './TilbakekrevingVedtak';

describe('<TilbakekrevingVedtak>', () => {
  const perioder = [
    {
      periode: { fom: '2019-10-10', tom: '2019-12-10' },
      feilutbetaltBeløp: 15430,
      vurdering: 'SIMP', // 'VURDERING'
      andelAvBeløp: 100,
      renterProsent: 10,
      tilbakekrevingBeløp: 15430,
    },
    {
      periode: { fom: '2019-05-10', tom: '2019-06-10' },
      feilutbetaltBeløp: 14000,
      vurdering: 'SIMP', // 'VURDERING'
      andelAvBeløp: 50,
      tilbakekrevingBeløp: 7000,
    },
  ];

  it('skal vise vedtakspanel for tilbakekreving', () => {
    renderWithIntlAndReduxForm(
      <KodeverkProvider
        behandlingType={BehandlingType.TILBAKEKREVING}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <TilbakekrevingVedtak
          submitCallback={vi.fn()}
          readOnly={false}
          resultat="testresultat"
          perioder={perioder as BeregningResultatPeriode[]}
          behandlingId={1}
          behandlingUuid="uuid"
          behandlingVersjon={1}
          avsnittsliste={[]}
          fetchPreviewVedtaksbrev={vi.fn()}
          aksjonspunktKodeForeslaVedtak="1234"
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('tilbakekrevingvedtakform')).toBeInTheDocument();
  });
});
