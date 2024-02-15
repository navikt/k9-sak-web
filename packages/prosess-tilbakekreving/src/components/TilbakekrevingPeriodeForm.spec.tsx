import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import Aktsomhet from '../kodeverk/aktsomhet';
import SarligGrunn from '../kodeverk/sarligGrunn';
import vilkarResultat from '../kodeverk/vilkarResultat';
import DataForPeriode from '../types/dataForPeriodeTsType';
import { CustomVilkarsVurdertePeriode, TilbakekrevingPeriodeFormImpl } from './TilbakekrevingPeriodeForm';

describe('<TilbakekrevingPeriodeForm>', () => {
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

  it('skal vise panel for foreldet periode', () => {
    const periode = {
      erForeldet: true,
      ytelser: [],
    } as DataForPeriode;
    renderWithIntlAndReduxForm(
      <TilbakekrevingPeriodeFormImpl
        data={periode}
        behandlingFormPrefix="behandling_V1"
        skjulPeriode={() => undefined}
        readOnly={false}
        erBelopetIBehold
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr
        oppdaterPeriode={() => undefined}
        oppdaterSplittedePerioder={() => undefined}
        setNestePeriode={() => undefined}
        setForrigePeriode={() => undefined}
        antallPerioderMedAksjonspunkt={2}
        vilkarResultatTyper={[]}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        reduserteBelop={[]}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={() => undefined}
        intl={intlMock}
        vilkarsVurdertePerioder={[]}
        handletUaktsomhetGrad={Aktsomhet.FORSETT}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om perioden er foreldet')).toBeInTheDocument();
  });

  it('skal teste kopiering av vilkårsvudering for periode', async () => {
    const periode = {
      erForeldet: false,
      begrunnelse: null,
      fom: '2020-04-01',
      tom: '2020-04-15',
      ytelser: [],
    } as DataForPeriode;

    const vilkårsPerioder = [
      {
        erForeldet: false,
        begrunnelse: 'Begrunnelse periode 1',
        valgtVilkarResultatType: vilkarResultat.GOD_TRO,
        vurderingBegrunnelse: 'Vurdering periode 1',
        harMerEnnEnYtelse: false,
        fom: '2020-03-01',
        tom: '2020-03-15',
        GOD_TRO: {
          erBelopetIBehold: false,
        },
      },
      {
        erForeldet: false,
        begrunnelse: 'Begrunnelse periode 2',
        valgtVilkarResultatType: vilkarResultat.FORSTO_BURDE_FORSTAATT,
        vurderingBegrunnelse: 'Vurdering periode 2',
        fom: '2020-03-15',
        tom: '2020-03-31',
        FORSTO_BURDE_FORSTAATT: {
          handletUaktsomhetGrad: Aktsomhet.FORSETT,
          FORSETT: {
            skalDetTilleggesRenter: false,
          },
        },
      },
      {
        erForeldet: false,
        valgtVilkarResultatType: null,
        fom: '2020-04-01',
        tom: '2020-04-15',
      },
      {
        erForeldet: false,
        fom: '2020-04-15',
        tom: '2020-04-30',
      },
    ] as CustomVilkarsVurdertePeriode[];

    const changeValue = sinon.spy();
    renderWithIntlAndReduxForm(
      <TilbakekrevingPeriodeFormImpl
        data={periode}
        behandlingFormPrefix="behandling_V1"
        skjulPeriode={() => undefined}
        readOnly={false}
        erBelopetIBehold
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr
        oppdaterPeriode={() => undefined}
        oppdaterSplittedePerioder={() => undefined}
        setNestePeriode={() => undefined}
        setForrigePeriode={() => undefined}
        antallPerioderMedAksjonspunkt={2}
        vilkarResultatTyper={[]}
        aktsomhetTyper={aktsomhetTyper}
        sarligGrunnTyper={sarligGrunnTyper}
        reduserteBelop={[]}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={() => undefined}
        intl={intlMock}
        vilkarsVurdertePerioder={vilkårsPerioder}
        handletUaktsomhetGrad={Aktsomhet.FORSETT}
        {...reduxFormPropsMock}
        change={changeValue}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), '15.03.2020 - 31.03.2020');
    });

    const changeValueCalls = changeValue.getCalls();
    expect(changeValueCalls).toHaveLength(4);
    expect(changeValueCalls[0].args[1]).toEqual(vilkårsPerioder[1].valgtVilkarResultatType);
    expect(changeValueCalls[1].args[1]).toEqual(vilkårsPerioder[1].begrunnelse);
    expect(changeValueCalls[2].args[1]).toEqual(vilkårsPerioder[1].vurderingBegrunnelse);
    expect(changeValueCalls[3].args[1]).toEqual(vilkårsPerioder[1][vilkarResultat.FORSTO_BURDE_FORSTAATT]);
  });

  // TODO (TOR) Skriv fleire testar
});
