import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/src/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import Aktsomhet from '../../../kodeverk/aktsomhet';
import SarligGrunn from '../../../kodeverk/sarligGrunn';
import AktsomhetGradFormPanel from './AktsomhetGradFormPanel';

describe('<AktsomhetGradFormPanel>', () => {
  const sarligGrunnTyper = [
    {
      kode: SarligGrunn.GRAD_AV_UAKTSOMHET,
      navn: 'grad av uaktsomhet',
      kodeverk: '',
    },
    {
      kode: SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
      navn: 'navs feil',
      kodeverk: '',
    },
  ];

  it('skal vise panel for å forsett når denne radio-knappen er valgt', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetGradFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.FORSETT}
        erSerligGrunnAnnetValgt
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(screen.getByText('Andel som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.queryByText('Særlige grunner 4. ledd')).not.toBeInTheDocument();
  });

  it('skal vise panel for å grovt uaktsomt når denne radio-knappen er valgt', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetGradFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        erSerligGrunnAnnetValgt
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(screen.getByText('Særlige grunner 4. ledd')).toBeInTheDocument();
    expect(screen.queryByText('Andel som skal tilbakekreves')).not.toBeInTheDocument();
  });
});
