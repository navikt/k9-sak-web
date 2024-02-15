import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import SarligGrunn from '../../../kodeverk/sarligGrunn';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

describe('<AktsomhetSarligeGrunnerFormPanel>', () => {
  it('skal vise alle særlige grunner', () => {
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
    renderWithIntlAndReduxForm(
      <AktsomhetSarligeGrunnerFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad=""
        erSerligGrunnAnnetValgt={false}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={10}
      />,
      { messages },
    );

    expect(screen.getByRole('checkbox', { name: 'grad av uaktsomhet' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'navs feil' })).toBeInTheDocument();
  });

  it('skal vise tekstfelt for annet-begrunnelse når annet er valgt som særlig grunn', () => {
    const sarligGrunnTyper = [
      {
        kode: SarligGrunn.ANNET,
        navn: 'annet',
        kodeverk: '',
      },
      {
        kode: SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
        navn: 'navs feil',
        kodeverk: '',
      },
    ];
    renderWithIntlAndReduxForm(
      <AktsomhetSarligeGrunnerFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad=""
        erSerligGrunnAnnetValgt
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse
        feilutbetalingBelop={10}
      />,
      { messages },
    );

    expect(screen.getByTestId('annetBegrunnelse')).toBeInTheDocument();
  });
});
