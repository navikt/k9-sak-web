import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import SarligGrunn from '../kodeverk/sarligGrunn';
import Aktsomhet from '../kodeverk/aktsomhet';
import ForeldetFormPanel from './tilbakekrevingPeriodePaneler/ForeldetFormPanel';
import {CustomVilkarsVurdertePeriode, TilbakekrevingPeriodeFormImpl} from './TilbakekrevingPeriodeForm';
import vilkarResultat from '../kodeverk/vilkarResultat';
import DataForPeriode from "../types/dataForPeriodeTsType";

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
    const wrapper = shallow(
      <TilbakekrevingPeriodeFormImpl
        periode={periode}
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
    );

    expect(wrapper.find(ForeldetFormPanel)).to.have.length(1);
  });

  it('skal teste kopiering av vilkårsvudering for periode', () => {
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
    const wrapper = shallow(
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
    );

    // Tester om nedtrekksmenyen for perioder som kan kopieres vises
    const selectField = wrapper.find('[name="perioderForKopi"]');
    expect(selectField).to.have.lengthOf(1);
    // @ts-ignore
    const values = selectField.props().selectValues;
    expect(values).to.have.lengthOf(2);

    selectField.props().onChange(
      {
        preventDefault: () => {},
        target: {
          value: '2020-03-15_2020-03-31',
        },
      },
      // @ts-ignore Fiks
      vilkårsPerioder,
    );

    const changeValueCalls = changeValue.getCalls();
    expect(changeValueCalls).to.have.length(4);
    expect(changeValueCalls[0].args[1]).to.be.eql(vilkårsPerioder[1].valgtVilkarResultatType);
    expect(changeValueCalls[1].args[1]).to.be.eql(vilkårsPerioder[1].begrunnelse);
    expect(changeValueCalls[2].args[1]).to.be.eql(vilkårsPerioder[1].vurderingBegrunnelse);
    expect(changeValueCalls[3].args[1]).to.be.eql(vilkårsPerioder[1][vilkarResultat.FORSTO_BURDE_FORSTAATT]);
  });

  // TODO (TOR) Skriv fleire testar
});
