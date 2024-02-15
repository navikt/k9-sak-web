import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';
import TilbakekrevingVedtak from './TilbakekrevingVedtak';

describe('<TilbakekrevingVedtak>', () => {
  const perioder = [
    {
      periode: { fom: '2019-10-10', tom: '2019-12-10' },
      feilutbetaltBeløp: 15430,
      vurdering: {
        kode: 'SIMP',
        kodeverk: 'VURDERING',
      },
      andelAvBeløp: 100,
      renterProsent: 10,
      tilbakekrevingBeløp: 15430,
    },
    {
      periode: { fom: '2019-05-10', tom: '2019-06-10' },
      feilutbetaltBeløp: 14000,
      vurdering: {
        kode: 'SIMP',
        kodeverk: 'VURDERING',
      },
      andelAvBeløp: 50,
      tilbakekrevingBeløp: 7000,
    },
  ];

  it('skal vise vedtakspanel for tilbakekreving', () => {
    renderWithIntlAndReduxForm(
      <TilbakekrevingVedtak
        submitCallback={sinon.spy()}
        readOnly={false}
        resultat={{ kode: 'testresultat', kodeverk: '' }}
        perioder={perioder as BeregningResultatPeriode[]}
        behandlingId={1}
        behandlingUuid="uuid"
        behandlingVersjon={1}
        alleKodeverk={{}}
        avsnittsliste={[]}
        fetchPreviewVedtaksbrev={sinon.spy()}
        aksjonspunktKodeForeslaVedtak="1234"
      />,
      { messages },
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('tilbakekrevingvedtakform')).toBeInTheDocument();
  });
});
