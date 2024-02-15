import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import Aktsomhet from '../kodeverk/aktsomhet';
import VilkarResultat from '../kodeverk/vilkarResultat';
import DataForPeriode from '../types/dataForPeriodeTsType';
import { DetaljertFeilutbetalingPeriode } from '../types/detaljerteFeilutbetalingsperioderTsType';
import { slaSammenOriginaleOgLagredePeriode, TilbakekrevingFormImpl } from './TilbakekrevingForm';
import { CustomVilkarsVurdertePeriode } from './TilbakekrevingPeriodeForm';

const alleKodeverk = {
  Aktsomhet: [
    {
      kode: Aktsomhet.FORSETT,
      navn: 'Forsett',
      kodeverk: '',
    },
    {
      kode: Aktsomhet.GROVT_UAKTSOM,
      navn: 'Grovt uaktsom',
      kodeverk: '',
    },
    {
      kode: Aktsomhet.SIMPEL_UAKTSOM,
      navn: 'Simpel uaktsom',
      kodeverk: '',
    },
  ],
  VilkårResultat: [
    {
      kode: VilkarResultat.FORSTO_BURDE_FORSTAATT,
      navn: 'Ja, mottaker forsto eller burde forstått at utbetalingen skyldtes en feil (1. ledd, 1. punkt)',
      kodeverk: '',
    },
    {
      kode: VilkarResultat.FEIL_OPPLYSNINGER,
      navn: 'Ja, mottaker har forårsaket feilutbetalingen ved forsett eller uaktsomt gitt feilaktige opplysninger (1. ledd, 2 punkt)',
      kodeverk: '',
    },
    {
      kode: VilkarResultat.MANGELFULL_OPPLYSNING,
      navn: 'Ja, mottaker har forårsaket feilutbetalingen ved forsett eller uaktsomt gitt mangelfulle opplysninger (1. ledd, 2 punkt)',
      kodeverk: '',
    },
    {
      kode: VilkarResultat.GOD_TRO,
      navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      kodeverk: '',
    },
  ],
};

describe('<TilbakekrevingForm>', () => {
  it('skal vise tidslinje når en har perioder', () => {
    const perioder = [
      {
        fom: '2019-01-01',
        tom: '2019-01-10',
        begrunnelse: undefined,
      },
    ] as CustomVilkarsVurdertePeriode[];
    const perioderDetail = [
      {
        fom: '2019-01-01',
        tom: '2019-01-10',
        redusertBeloper: [],
        ytelser: [],
      },
    ] as DataForPeriode[];

    renderWithIntlAndReduxForm(
      <TilbakekrevingFormImpl
        {...reduxFormPropsMock}
        vilkarsVurdertePerioder={perioder}
        dataForDetailForm={perioderDetail}
        behandlingFormPrefix="behandling_V1"
        navBrukerKjonn={navBrukerKjonn.KVINNE}
        readOnly={false}
        readOnlySubmitButton={false}
        reduxFormChange={() => undefined}
        reduxFormInitialize={() => undefined}
        antallPerioderMedAksjonspunkt={2}
        handleSubmit={() => undefined}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        behandlingId={1}
        behandlingVersjon={2}
        alleKodeverk={alleKodeverk}
        beregnBelop={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Åpne info om første periode')).toBeInTheDocument();
    expect(screen.getByText('Detaljer for valgt periode')).toBeInTheDocument();
    expect(screen.getByText('Vilkårene for tilbakekreving')).toBeInTheDocument();
  });

  it('skal ikke vise tidslinje når en har perioder', () => {
    const perioder = undefined;
    renderWithIntlAndReduxForm(
      <TilbakekrevingFormImpl
        {...reduxFormPropsMock}
        vilkarsVurdertePerioder={perioder}
        dataForDetailForm={perioder}
        behandlingFormPrefix="behandling_V1"
        navBrukerKjonn={navBrukerKjonn.KVINNE}
        readOnly={false}
        readOnlySubmitButton={false}
        reduxFormChange={() => undefined}
        reduxFormInitialize={() => undefined}
        antallPerioderMedAksjonspunkt={2}
        handleSubmit={() => undefined}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        behandlingId={1}
        behandlingVersjon={2}
        alleKodeverk={alleKodeverk}
        beregnBelop={() => undefined}
      />,
      { messages },
    );

    expect(screen.queryByText('Åpne info om første periode')).not.toBeInTheDocument();
    expect(screen.queryByText('Detaljer for valgt periode')).not.toBeInTheDocument();
    expect(screen.queryByText('Vilkårene for tilbakekreving')).not.toBeInTheDocument();
    expect(screen.queryByText('feil')).not.toBeInTheDocument();
  });

  it('skal vise feilmelding når en har dette', () => {
    const perioder = undefined;
    renderWithIntlAndReduxForm(
      <TilbakekrevingFormImpl
        {...reduxFormPropsMock}
        vilkarsVurdertePerioder={perioder}
        dataForDetailForm={perioder}
        behandlingFormPrefix="behandling_V1"
        navBrukerKjonn={navBrukerKjonn.KVINNE}
        readOnly={false}
        readOnlySubmitButton={false}
        reduxFormChange={() => undefined}
        reduxFormInitialize={() => undefined}
        antallPerioderMedAksjonspunkt={2}
        handleSubmit={() => undefined}
        merknaderFraBeslutter={{
          notAccepted: false,
        }}
        behandlingId={1}
        behandlingVersjon={2}
        alleKodeverk={alleKodeverk}
        beregnBelop={() => undefined}
        error="TilbakekrevingPeriodeForm.TotalbelopetUnder4Rettsgebyr"
      />,
      { messages },
    );

    expect(screen.getByText('feil')).toBeInTheDocument();
  });

  it('skal lage initial values til form der en har lagret en periode og den andre er foreldet', () => {
    const arsak = {
      hendelseType: {
        kode: 'MORS_AKTIVITET_TYPE',
        kodeverk: 'MORS_AKTIVITET_KRAV',
      },
      hendelseUndertype: {
        kodeverk: 'MORS_AKTIVITET_TYPE',
        kode: 'IKKE_ARBEIDET_HELTID',
      },
    };
    const oppfyltValg = {
      kode: '-',
      kodeverk: 'VILKAAR_RESULTAT',
    };
    const ytelser = [
      {
        aktivitet: 'Arbeidstakar',
        belop: 19000,
      },
    ];
    const originalePerioder = [
      {
        feilutbetaling: 32000,
        fom: '2016-03-16',
        tom: '2016-05-01',
        foreldet: true,
        oppfyltValg,
        redusertBeloper: [],
        ytelser,
        årsak: arsak,
      },
      {
        feilutbetaling: 19000,
        fom: '2016-05-02',
        tom: '2016-05-26',
        foreldet: false,
        oppfyltValg,
        redusertBeloper: [],
        ytelser,
        årsak: arsak,
      },
    ] as DetaljertFeilutbetalingPeriode[];
    const lagredePerioder = {
      vilkarsVurdertePerioder: [
        {
          feilutbetalingBelop: 19000,
          begrunnelse: '3434',
          fom: '2016-05-02',
          tom: '2016-05-26',
          vilkarResultat: {
            kode: VilkarResultat.GOD_TRO,
            kodeverk: 'VILKAAR_RESULTAT',
            navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
          },
          vilkarResultatInfo: {
            begrunnelse: '34344',
            erBelopetIBehold: true,
            tilbakekrevesBelop: 3434,
          },
        },
      ],
    };
    const rettsgebyr = 1000;

    const resultat = slaSammenOriginaleOgLagredePeriode.resultFunc(originalePerioder, lagredePerioder, rettsgebyr);

    expect(resultat.perioder).toHaveLength(2);
    expect(resultat.perioder[0]).toEqual({
      feilutbetaling: 32000,
      fom: '2016-03-16',
      tom: '2016-05-01',
      foreldet: true,
      harMerEnnEnYtelse: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      erTotalBelopUnder4Rettsgebyr: false,
    });
    expect(resultat.perioder[1]).toEqual({
      feilutbetaling: 19000,
      fom: '2016-05-02',
      tom: '2016-05-26',
      foreldet: false,
      harMerEnnEnYtelse: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      begrunnelse: '3434',
      vilkarResultat: {
        kode: VilkarResultat.GOD_TRO,
        kodeverk: 'VILKAAR_RESULTAT',
        navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      },
      vilkarResultatInfo: {
        begrunnelse: '34344',
        erBelopetIBehold: true,
        tilbakekrevesBelop: 3434,
      },
      erTotalBelopUnder4Rettsgebyr: false,
    });
  });

  it('skal lage initial values til form der en har splittet en periode i to', () => {
    const arsak = {
      hendelseType: {
        kode: 'MORS_AKTIVITET_TYPE',
        kodeverk: 'MORS_AKTIVITET_KRAV',
      },
      hendelseUndertype: {
        kodeverk: 'MORS_AKTIVITET_TYPE',
        kode: 'IKKE_ARBEIDET_HELTID',
      },
    };
    const oppfyltValg = {
      kode: '-',
      kodeverk: 'VILKAAR_RESULTAT',
    };
    const ytelser = [
      {
        aktivitet: 'Arbeidstakar',
        belop: 19000,
      },
    ];
    const originalePerioder = [
      {
        feilutbetaling: 32000,
        fom: '2016-03-16',
        tom: '2016-05-26',
        foreldet: false,
        oppfyltValg,
        redusertBeloper: [],
        ytelser,
        årsak: arsak,
      },
    ] as DetaljertFeilutbetalingPeriode[];
    const lagredePerioder = {
      vilkarsVurdertePerioder: [
        {
          begrunnelse: '3434',
          fom: '2016-03-16',
          tom: '2016-04-03',
          feilutbetalingBelop: 10000,
          vilkarResultat: {
            kode: VilkarResultat.GOD_TRO,
            kodeverk: 'VILKAAR_RESULTAT',
            navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
          },
          vilkarResultatInfo: {
            begrunnelse: '34344',
            erBelopetIBehold: true,
            tilbakekrevesBelop: 2312,
          },
        },
        {
          begrunnelse: 'test',
          fom: '2016-04-04',
          tom: '2016-05-26',
          feilutbetalingBelop: 22000,
          vilkarResultat: {
            kode: VilkarResultat.GOD_TRO,
            kodeverk: 'VILKAAR_RESULTAT',
            navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
          },
          vilkarResultatInfo: {
            begrunnelse: '34344',
            erBelopetIBehold: true,
            tilbakekrevesBelop: 3434,
          },
        },
      ],
    };
    const rettsgebyr = 1000;

    const resultat = slaSammenOriginaleOgLagredePeriode.resultFunc(originalePerioder, lagredePerioder, rettsgebyr);

    expect(resultat.perioder).toHaveLength(2);
    expect(resultat.perioder[0]).toEqual({
      feilutbetaling: 10000,
      fom: '2016-03-16',
      tom: '2016-04-03',
      foreldet: false,
      harMerEnnEnYtelse: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      begrunnelse: '3434',
      vilkarResultat: {
        kode: VilkarResultat.GOD_TRO,
        kodeverk: 'VILKAAR_RESULTAT',
        navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      },
      vilkarResultatInfo: {
        begrunnelse: '34344',
        erBelopetIBehold: true,
        tilbakekrevesBelop: 2312,
      },
      erTotalBelopUnder4Rettsgebyr: false,
    });
    expect(resultat.perioder[1]).toEqual({
      feilutbetaling: 22000,
      fom: '2016-04-04',
      tom: '2016-05-26',
      foreldet: false,
      harMerEnnEnYtelse: false,
      oppfyltValg,
      redusertBeloper: [],
      ytelser,
      årsak: arsak,
      begrunnelse: 'test',
      vilkarResultat: {
        kode: VilkarResultat.GOD_TRO,
        kodeverk: 'VILKAAR_RESULTAT',
        navn: 'Nei, mottaker har mottatt beløpet i god tro (1. ledd)',
      },
      vilkarResultatInfo: {
        begrunnelse: '34344',
        erBelopetIBehold: true,
        tilbakekrevesBelop: 3434,
      },
      erTotalBelopUnder4Rettsgebyr: false,
    });
  });

  // TODO (TOR) Test validateForm
  // TODO (TOR) Test mapStateToPropsFactory
  // TODO (TOR) Test leggTilTimelineData
});
