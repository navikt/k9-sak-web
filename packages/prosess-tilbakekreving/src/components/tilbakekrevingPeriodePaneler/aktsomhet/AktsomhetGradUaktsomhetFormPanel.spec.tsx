import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import Aktsomhet from '../../../kodeverk/aktsomhet';
import SarligGrunn from '../../../kodeverk/sarligGrunn';
import AktsomhetGradUaktsomhetFormPanel from './AktsomhetGradUaktsomhetFormPanel';

describe('<AktsomhetGradUaktsomhetFormPanel>', () => {
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

  it('skal måtte velge om en skal tilbakekreve beløp når totalbeløpet er under 4 rettsgebyr når grad er simpel uaktsom', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetGradUaktsomhetFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Ja' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Nei' })).toBeInTheDocument();
    expect(
      screen.getByText('Totalbeløpet er under 4 rettsgebyr (6. ledd). Skal det tilbakekreves?'),
    ).toBeInTheDocument();
  });

  it('skal ikke måtte velge om en skal tilbakekreve beløp når totalbeløpet er under 4 rettsgebyr med grad er ulik simpel uaktsom', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetGradUaktsomhetFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr
      />,
      { messages },
    );

    expect(
      screen.queryByText('Totalbeløpet er under 4 rettsgebyr (6. ledd). Skal det tilbakekreves?'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Særlige grunner som er vektlagt (4.ledd)')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Vurder særlige grunner du har vektlagt for resultatet' }),
    ).toBeInTheDocument();
  });

  it('skal ikke måtte velge om en skal tilbakekreve beløp når totalbeløpet er over 4 rettsgebyr med grad er lik simpel uaktsom', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetGradUaktsomhetFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(
      screen.queryByText('Totalbeløpet er under 4 rettsgebyr (6. ledd). Skal det tilbakekreves?'),
    ).not.toBeInTheDocument();

    expect(screen.getByText('Særlige grunner som er vektlagt (4.ledd)')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Vurder særlige grunner du har vektlagt for resultatet' }),
    ).toBeInTheDocument();
  });
});
