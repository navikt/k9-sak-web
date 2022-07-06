import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';

import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FordelBeregningsgrunnlagFaktaIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';

import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import withReduxProvider from '../../../decorators/withRedux';

import alleKodeverk from '../../mocks/alleKodeverk.json';
import arbeidsgivere from '../../mocks/arbeidsgivere.json';

import {
  beregningsgrunnlag as bgMedHelg,
} from './scenario/FlerePerioderMedHelg';

import {
  bgUtenDelvisRefusjon as vurderRefusjonBG,
  bgMedDelvisRefusjon as vurderDelvisRefBG,
  aksjonspunkt as vurderRefusjonAP,
} from './scenario/VurderRefusjon';

export default {
  title: 'fakta/fakta-fordel-beregningsgrunnlag',
  component: FordelBeregningsgrunnlagFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};

const lagBehandling = perioder => ({
  id: 1,
  versjon: 1,
  type: 'BT-003',
  behandlingsresultat: {
    vilkårResultat: {
      BEREGNINGSGRUNNLAGVILKÅR: perioder.map(p => ({
        periode: {
          ...p,
        },
      })),
    },
  },
});

const merknaderFraBeslutter = {
  notAccepted: false,
};

const fordelAP = [
  {
    definisjon: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
    status: 'OPPR',
    begrunnelse: null,
    erAktivt: true,
    kanLoses: true,
  },
];

const fordelAvklaringsbehov = [
  {
    definisjon: aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
    status: 'OPPR',
    begrunnelse: null,
  },
];

const lagBGAndel = (andelsnr, aktivitetstatuskode, beregnet) => ({
  beregningsgrunnlagTom: '2019-08-31',
  beregningsgrunnlagFom: '2019-06-01',
  aktivitetStatus: aktivitetstatuskode,
  beregningsperiodeFom: '2019-06-01',
  beregningsperiodeTom: '2019-08-31',
  beregnetPrAar: beregnet,
  fastsattForrigePrAar: null,
  overstyrtPrAar: null,
  bruttoPrAar: beregnet,
  andelsnr,
  inntektskategori: 'ARBEIDSTAKER',
  fordeltPrAar: null,
  erTilkommetAndel: false,
});

const lagBGPeriode = (andelsliste, fom, tom, periodeAarsaker) => {
  const sum = andelsliste.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  return {
    beregningsgrunnlagPeriodeFom: fom,
    beregningsgrunnlagPeriodeTom: tom,
    beregnetPrAar: sum,
    bruttoPrAar: sum,
    bruttoInkludertBortfaltNaturalytelsePrAar: sum,
    periodeAarsaker,
    beregningsgrunnlagPrStatusOgAndel: andelsliste,
    andelerLagtTilManueltIForrige: [],
  };
};

const lagBG = (perioder, faktaOmFordeling) => {
  const beregningsgrunnlag = {
    avklaringsbehov: fordelAvklaringsbehov,
    skjaeringstidspunktBeregning: '2019-09-16',
    aktivitetStatus: [],
    beregningsgrunnlagPeriode: perioder,
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2018-09-01',
      sammenligningsgrunnlagTom: '2019-08-31',
      rapportertPrAar: 330000,
      avvikPromille: 91,
      avvikProsent: 9,
    },
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
    halvG: 49929,
    faktaOmBeregning: {
      kortvarigeArbeidsforhold: null,
      frilansAndel: null,
      kunYtelse: null,
      faktaOmBeregningTilfeller: null,
      arbeidstakerOgFrilanserISammeOrganisasjonListe: null,
      arbeidsforholdMedLønnsendringUtenIM: null,
      vurderMottarYtelse: null,
      avklarAktiviteter: {
        skjæringstidspunkt: '2019-09-16',
        aktiviteterTomDatoMapping: [
          {
            tom: '2019-09-16',
            aktiviteter: [
              {
                arbeidsgiverIdent: '910909088',
                fom: '2018-10-09',
                tom: '9999-12-31',
                arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
                arbeidsforholdType: 'ARBEID',
                aktørId: null,
                skalBrukes: null,
              },
            ],
          },
        ],
      },
      andelerForFaktaOmBeregning: [
        {
          belopReadOnly: 30000,
          fastsattBelop: null,
          inntektskategori: 'ARBEIDSTAKER',
          aktivitetStatus: 'AT',
          refusjonskrav: 30000,
          visningsnavn: 'BEDRIFT AS (910909088) ...55bb',
          arbeidsforhold: {
            arbeidsgiverIdent: '910909088',
            startdato: '2018-10-09',
            opphoersdato: null,
            arbeidsforholdId: '2a3c0f5c-3d70-447a-b0d7-cd242d5155bb',
            arbeidsforholdType: 'ARBEID',
            aktørId: null,
            refusjonPrAar: null,
            belopFraInntektsmeldingPrMnd: 30000,
            organisasjonstype: 'VIRKSOMHET',
            naturalytelseBortfaltPrÅr: null,
            naturalytelseTilkommetPrÅr: null,
          },
          andelsnr: 1,
          skalKunneEndreAktivitet: false,
          lagtTilAvSaksbehandler: false,
        },
      ],
      vurderMilitaer: null,
      refusjonskravSomKommerForSentListe: null,
    },
    hjemmel: 'F_14_7_8_30',
    faktaOmFordeling,
    årsinntektVisningstall: 360000,
  };
  return beregningsgrunnlag;
};

const lagFaktaOmFordeling = (arbfor, perioder) => ({
  fordelBeregningsgrunnlag: {
    arbeidsforholdTilFordeling: arbfor,
    fordelBeregningsgrunnlagPerioder: perioder,
  },
});

const lagArbforTilFordeling = (arbGiverId, arbId, refKrav, refKravFom) => ({
  aktørId: null,
  arbeidsforholdId: arbId,
  arbeidsforholdType: 'ARBEID',
  arbeidsgiverIdent: arbGiverId,
  belopFraInntektsmeldingPrMnd: null,
  eksternArbeidsforholdId: 'ARB001-001',
  naturalytelseBortfaltPrÅr: null,
  naturalytelseTilkommetPrÅr: null,
  opphoersdato: '2020-10-27',
  organisasjonstype: 'VIRKSOMHET',
  perioderMedGraderingEllerRefusjon: [
    {
      erRefusjon: true,
      erGradering: false,
      fom: refKravFom,
      tom: null,
    },
  ],
  permisjon: null,
  refusjonPrAar: refKrav,
  startdato: '2019-11-27',
});

const mapIKKode = bgStatus => {
  switch (bgStatus) {
    case 'AT':
      return inntektskategorier.ARBEIDSTAKER;
    case 'AAP':
      return inntektskategorier.ARBEIDSAVKLARINGSPENGER;
    case 'FL':
      return inntektskategorier.FRILANSER;
    case 'SN':
      return inntektskategorier.SELVSTENDIG_NÆRINGSDRIVENDE;
    default:
      return inntektskategorier.UDEFINERT;
  }
};

const lagFordelingsandel = (andelsnr, status, ref, fordelt) => ({
  aktivitetStatus: {
    kode: status,
    kodeverk: 'AKTIVITET_STATUS',
  },
  andelsnr,
  arbeidsforhold: null,
  arbeidsforholdType: {
    kode: '-',
    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
  },
  andelIArbeid: [0],
  belopFraInntektsmeldingPrAar: null,
  fastsattForrigePrAar: null,
  fordelingForrigeBehandlingPrAar: null,
  fordeltPrAar: fordelt,
  inntektskategori: {
    kode: mapIKKode(status),
    kodeverk: 'INNTEKTSKATEGORI',
  },
  lagtTilAvSaksbehandler: false,
  nyttArbeidsforhold: false,
  refusjonskravFraInntektsmeldingPrAar: ref,
  refusjonskravPrAar: ref,
});

const lagFordelPeriode = (fordelAndeler, fom, tom, graderingEllerRef) => ({
  fom,
  fordelBeregningsgrunnlagAndeler: fordelAndeler,
  harPeriodeAarsakGraderingEllerRefusjon: graderingEllerRef,
  skalRedigereInntekt: graderingEllerRef,
  tom,
});

const lagArbeidsforhold = (arbeidsgiverIdent, arbeidsforholdId, refKrav) => ({
  arbeidsgiverIdent,
  startdato: '2018-10-09',
  opphoersdato: null,
  arbeidsforholdId,
  arbeidsforholdType: {
    kode: 'ARBEID',
    kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
  },
  aktørId: null,
  refusjonPrAar: refKrav,
  organisasjonstype: {
    kode: 'VIRKSOMHET',
    kodeverk: 'ORGANISASJONSTYPE',
  },
  naturalytelseBortfaltPrÅr: null,
  naturalytelseTilkommetPrÅr: null,
});

export const flerePerioderMedHelg = () => (
  <FordelBeregningsgrunnlagFaktaIndex
    behandling={lagBehandling([{ fom: '2021-06-28' }])}
    alleKodeverk={alleKodeverk}
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={false}
    beregningsgrunnlag={bgMedHelg}
    aksjonspunkter={fordelAP}
    harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
    submittable={boolean('submittable', true)}
  />
);


export const aapOgRefusjon = () => {
  const førsteAndeler = [lagFordelingsandel(1, 'AAP', 0, 0)];
  const førstePeriode = lagFordelPeriode(førsteAndeler, '2019-08-05', '2019-11-26', false);
  const andreAndeler = [lagFordelingsandel(2, 'AAP', 0, 0), lagFordelingsandel(1, 'AT', 300_000, 0)];
  const arbeidsforhold = lagArbeidsforhold('999999999', 'AD-ASD-ADF-SADGF-ASGASDF-SDFASDF', 300000);
  andreAndeler[1].arbeidsforhold = arbeidsforhold;
  const andrePeriode = lagFordelPeriode(andreAndeler, '2019-11-27', undefined, true);
  const arbfor = lagArbforTilFordeling('999999999', 'AD-ASD-ADF-SADGF-ASGASDF-SDFASDF', 300000, '2019-11-27');
  const faktaOmFordeling = lagFaktaOmFordeling([arbfor], [førstePeriode, andrePeriode]);

  const førsteBGPeriode = lagBGPeriode([lagBGAndel(1, 'AAP', 100000)], '2019-08-05', '2019-11-26', []);
  const atAndel = lagBGAndel(1, 'AT', null);
  atAndel.arbeidsforhold = arbeidsforhold;
  const aapAndel = lagBGAndel(2, 'AAP', 100000);
  const andreBGPperiode = lagBGPeriode([aapAndel, atAndel], '2019-11-27', null, [
    periodeAarsak.ENDRING_I_REFUSJONSKRAV,
  ]);
  const bg = lagBG([førsteBGPeriode, andreBGPperiode], faktaOmFordeling);
  return (
    <FordelBeregningsgrunnlagFaktaIndex
      behandling={lagBehandling([{ fom: '2019-09-16' }])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={false}
      beregningsgrunnlag={[bg]}
      aksjonspunkter={fordelAP}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const skalSlåSammenNaturalytelseperioder = () => {
  const arbeidsforholdEn = lagArbeidsforhold('12345678', 'AD-ASD-ADF-SADGF-ASGASDF-ÅTYIUOH', 500000);
  const arbeidsforholdTo = lagArbeidsforhold('9109090883', 'AD-ASD-ADF-SADGF-ASGASDF-SDFASDF', 300000);

  // Første periode
  const førsteFordelAndel = lagFordelingsandel(1, 'AT', 0, 0);
  førsteFordelAndel.arbeidsforhold = arbeidsforholdEn;
  const førstePeriode = lagFordelPeriode([førsteFordelAndel], '2019-08-05', '2019-11-26', false, false);
  const førsteBGAndel = lagBGAndel(1, 'AT', 100000);
  førsteBGAndel.arbeidsforhold = arbeidsforholdEn;
  const førsteBGPeriode = lagBGPeriode([førsteBGAndel], '2019-08-05', '2019-11-26', []);

  // Andre periode
  const andreFordelAndel = lagFordelingsandel(1, 'AT', 0, 0);
  andreFordelAndel.arbeidsforhold = arbeidsforholdEn;
  const andrePeriode = lagFordelPeriode([andreFordelAndel], '2019-11-27', '2019-12-05', false, false);
  const andreBGAndel = lagBGAndel(1, 'AT', 100000);
  andreBGAndel.arbeidsforhold = arbeidsforholdEn;
  const andreBGPperiode = lagBGPeriode([andreBGAndel], '2019-11-27', '2019-12-05', [
    periodeAarsak.NATURALYTELSE_BORTFALT,
  ]);

  // Tredje periode
  const tredjeAndeler = [lagFordelingsandel(1, 'AT', 0, 0), lagFordelingsandel(2, 'AT', 300000, 0)];
  tredjeAndeler[0].arbeidsforhold = arbeidsforholdEn;
  tredjeAndeler[1].arbeidsforhold = arbeidsforholdTo;
  const tredjePeriode = lagFordelPeriode(tredjeAndeler, '2019-12-06', undefined, true);
  const atAndel = lagBGAndel(1, 'AT', 100000);
  atAndel.arbeidsforhold = arbeidsforholdEn;
  const atAndelTo = lagBGAndel(2, 'AT', 300000);
  atAndelTo.arbeidsforhold = arbeidsforholdTo;
  const tredjeBGPeriode = lagBGPeriode([atAndel, atAndelTo], '2019-12-06', null, [
    periodeAarsak.ENDRING_I_REFUSJONSKRAV,
  ]);

  const arbfor = lagArbforTilFordeling('9109090883', 'AD-ASD-ADF-SADGF-ASGASDF-SDFASDF', 300000, '2019-12-06');
  const faktaOmFordeling = lagFaktaOmFordeling([arbfor], [førstePeriode, andrePeriode, tredjePeriode]);

  const bg = lagBG([førsteBGPeriode, andreBGPperiode, tredjeBGPeriode], faktaOmFordeling);
  return (
    <FordelBeregningsgrunnlagFaktaIndex
      behandling={lagBehandling([{ fom: '2019-09-16' }])}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgivere}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={false}
      beregningsgrunnlag={[bg]}
      aksjonspunkter={fordelAP}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );

};

export const viseVurderTilkommetRefusjonskrav = () => (
  <FordelBeregningsgrunnlagFaktaIndex
    behandling={lagBehandling([{ fom: '2020-05-15' }])}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={false}
    beregningsgrunnlag={[vurderRefusjonBG]}
    aksjonspunkter={vurderRefusjonAP}
    harApneAksjonspunkter
    submittable
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
  />
);

export const skalVurdereTilkommetØktRefusjonPåTidligereInnvilgetDelvisRefusjon = () => (
  <FordelBeregningsgrunnlagFaktaIndex
    behandling={lagBehandling([{ fom: '2020-06-01' }])}
    alleKodeverk={alleKodeverk}
    alleMerknaderFraBeslutter={{
      [aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
    }}
    submitCallback={action('button-click')}
    readOnly={false}
    beregningsgrunnlag={[vurderDelvisRefBG]}
    aksjonspunkter={vurderRefusjonAP}
    harApneAksjonspunkter
    submittable
    arbeidsgiverOpplysningerPerId={arbeidsgivere}
  />
);
