import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Systemtittel } from 'nav-frontend-typografi';

import TilbakekrevingVedtak from './TilbakekrevingVedtak';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';

describe('<TilbakekrevingVedtak>', () => {
  const perioder = [
    {
      periode: { fom: '2019-10-10', tom: '2019-12-10' },
      feilutbetaltBeløp: 15430,
      vurdering: 'SIMP',
      andelAvBeløp: 100,
      renterProsent: 10,
      tilbakekrevingBeløp: 15430,
    },
    {
      periode: ['2019-05-10', '2019-06-10'],
      feilutbetaltBeløp: 14000,
      vurdering: 'SIMP',
      andelAvBeløp: 50,
      tilbakekrevingBeløp: 7000,
    },
  ];

  it('skal vise vedtakspanel for tilbakekreving', () => {
    const wrapper = shallow(
      <TilbakekrevingVedtak
        submitCallback={sinon.spy()}
        readOnly={false}
        resultat="testresultat"
        perioder={perioder as BeregningResultatPeriode[]}
        behandlingId={1}
        behandlingUuid="uuid"
        behandlingVersjon={1}
        alleKodeverk={{}}
        avsnittsliste={[]}
        fetchPreviewVedtaksbrev={sinon.spy()}
        aksjonspunktKodeForeslaVedtak="1234"
      />,
    );

    expect(wrapper.find(TilbakekrevingVedtakPeriodeTabell)).toHaveLength(1);
    expect(wrapper.find(TilbakekrevingVedtakForm)).toHaveLength(1);
    expect(wrapper.find(Systemtittel)).toHaveLength(0);
  });
});
