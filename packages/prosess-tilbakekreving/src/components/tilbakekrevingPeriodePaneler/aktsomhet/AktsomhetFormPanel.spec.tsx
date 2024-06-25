import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import Aktsomhet from '../../../kodeverk/aktsomhet';
import SarligGrunn from '../../../kodeverk/sarligGrunn';
import AktsomhetFormPanel from './AktsomhetFormPanel';

describe('<AktsomhetFormPanel>', () => {
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
  const aktsomhetTyper = [
    {
      kode: Aktsomhet.GROVT_UAKTSOM,
      navn: 'grovt',
      kodeverk: '',
    },
    {
      kode: Aktsomhet.SIMPEL_UAKTSOM,
      navn: 'simpel',
      kodeverk: '',
    },
    {
      kode: Aktsomhet.FORSETT,
      navn: 'forsett',
      kodeverk: '',
    },
  ];

  it('skal vise radioknapp for hver aksomhetstype', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetFormPanel
        readOnly={false}
        resetFields={vi.fn()}
        handletUaktsomhetGrad={undefined}
        harGrunnerTilReduksjon
        erSerligGrunnAnnetValgt={false}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        antallYtelser={2}
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.queryByText('Særlige grunner 4. ledd')).not.toBeInTheDocument();
  });

  it('skal vise panel for aktsomhet når dette er valgt', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetFormPanel
        readOnly={false}
        resetFields={vi.fn()}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harGrunnerTilReduksjon
        erSerligGrunnAnnetValgt={false}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        antallYtelser={2}
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(screen.getByText('Særlige grunner 4. ledd')).toBeInTheDocument();
  });

  it('skal ikke vise panel for aktsomhet når dette ikke er valgt', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetFormPanel
        readOnly={false}
        resetFields={vi.fn()}
        handletUaktsomhetGrad={undefined}
        harGrunnerTilReduksjon
        erSerligGrunnAnnetValgt={false}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        antallYtelser={2}
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(screen.queryByText('Særlige grunner 4. ledd')).not.toBeInTheDocument();
  });

  it('skal vise riktig labels når valg resultattype ikke er Forsto/Burde forstått', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetFormPanel
        readOnly={false}
        resetFields={vi.fn()}
        handletUaktsomhetGrad={undefined}
        erValgtResultatTypeForstoBurdeForstaatt={false}
        harGrunnerTilReduksjon
        erSerligGrunnAnnetValgt={false}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        antallYtelser={2}
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );

    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByRole('radio', { name: 'forsett' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'simpel' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'grovt' })).toBeInTheDocument();
  });

  it('skal vise riktig labels når valg resultattype er Forsto/Burde forstått', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetFormPanel
        readOnly={false}
        resetFields={vi.fn()}
        handletUaktsomhetGrad={undefined}
        erValgtResultatTypeForstoBurdeForstaatt
        harGrunnerTilReduksjon
        erSerligGrunnAnnetValgt={false}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        antallYtelser={2}
        feilutbetalingBelop={100}
        erTotalBelopUnder4Rettsgebyr={false}
      />,
      { messages },
    );
    expect(screen.getAllByRole('radio').length).toBe(3);
    expect(screen.getByText('Må ha forstått')).toBeInTheDocument();
    expect(screen.getByText('Burde ha forstått')).toBeInTheDocument();
    expect(screen.getByText('Forsto')).toBeInTheDocument();
  });

  it('skal lage form-initialvalues fra struktur når en har aktsomhetsgrad FORSETT', () => {
    const vilkarResultatInfo = {
      aktsomhet: { kode: Aktsomhet.FORSETT, kodeverk: '' },
    };
    const initialValues = AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo);

    expect(initialValues).toEqual({
      handletUaktsomhetGrad: Aktsomhet.FORSETT,
    });
  });

  it('skal lage form-initialvalues fra struktur når en har aktsomhetsgrad GROVT_UAKTSOM', () => {
    const vilkarResultatInfo = {
      aktsomhet: Aktsomhet.GROVT_UAKTSOM,
      aktsomhetInfo: {
        harGrunnerTilReduksjon: true,
        ileggRenter: true,
        andelTilbakekreves: 50,
        tilbakekrevesBelop: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunner: sarligGrunnTyper,
        sarligGrunnerBegrunnelse: undefined,
      },
    };
    const initialValues = AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo);

    expect(initialValues).toEqual({
      handletUaktsomhetGrad: Aktsomhet.GROVT_UAKTSOM,
      [Aktsomhet.GROVT_UAKTSOM]: {
        [SarligGrunn.GRAD_AV_UAKTSOMHET]: true,
        [SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL]: true,
        harGrunnerTilReduksjon: true,
        skalDetTilleggesRenter: true,
        andelSomTilbakekreves: '50',
        andelSomTilbakekrevesManuell: undefined,
        belopSomSkalTilbakekreves: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunnerBegrunnelse: undefined,
      },
    });
  });

  it('skal lage form-initialvalues fra struktur når en har andel som skal tilbakekreves som er ulik standardverdier', () => {
    const vilkarResultatInfo = {
      begrunnelse: 'test',
      aktsomhet: { kode: Aktsomhet.GROVT_UAKTSOM, kodeverk: '' },
      aktsomhetInfo: {
        harGrunnerTilReduksjon: true,
        ileggRenter: true,
        andelTilbakekreves: 10,
        tilbakekrevesBelop: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunner: sarligGrunnTyper,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
      },
    };
    const initialValues = AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo);

    expect(initialValues).toEqual({
      handletUaktsomhetGrad: Aktsomhet.GROVT_UAKTSOM,
      [Aktsomhet.GROVT_UAKTSOM]: {
        [SarligGrunn.GRAD_AV_UAKTSOMHET]: true,
        [SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL]: true,
        harGrunnerTilReduksjon: true,
        skalDetTilleggesRenter: true,
        andelSomTilbakekreves: 'Egendefinert',
        andelSomTilbakekrevesManuell: 10,
        belopSomSkalTilbakekreves: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
      },
    });
  });

  it('skal klargjøre data for lagring når en har FORSETT', () => {
    const info = {
      handletUaktsomhetGrad: Aktsomhet.FORSETT,
      aktsomhetBegrunnelse: 'test',
    };
    const vurderingBegrunnelse = 'test';
    const transformertData = AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse);

    expect(transformertData).toEqual({
      '@type': 'annet',
      aktsomhet: Aktsomhet.FORSETT,
      aktsomhetInfo: null,
      begrunnelse: 'test',
    });
  });

  it('skal klargjøre data for lagring når en har vært uaktsom', () => {
    const info = {
      handletUaktsomhetGrad: Aktsomhet.GROVT_UAKTSOM,
      aktsomhetBegrunnelse: 'test',
      [Aktsomhet.GROVT_UAKTSOM]: {
        [SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL]: true,
        harGrunnerTilReduksjon: true,
        skalDetTilleggesRenter: true,
        andelSomTilbakekreves: 70,
        belopSomSkalTilbakekreves: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
      },
    };
    const vurderingBegrunnelse = 'test';
    const transformertData = AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse);

    expect(transformertData).toEqual({
      '@type': 'annet',
      aktsomhet: Aktsomhet.GROVT_UAKTSOM,
      aktsomhetInfo: {
        harGrunnerTilReduksjon: true,
        ileggRenter: undefined,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
        sarligGrunner: [SarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL],
        andelTilbakekreves: 70,
        tilbakekrevesBelop: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
      },
      begrunnelse: 'test',
    });
  });
});
