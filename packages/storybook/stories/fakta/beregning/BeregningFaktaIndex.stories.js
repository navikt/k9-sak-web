import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';

import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import bgMedArbeidOgDagpenger from './scenario/ArbeidMedDagpengerIOpptjeningsperioden';

import {
    behandling as behPrivatArbeidsgiver,
    beregningsgrunnlag as bgPrivatArbeidsgiver
} from './scenario/PrivatpersonOrgOgFrilansISammeOrg';


import {
    behandling as behLønnsendringOgFlereArbeidsforholdISammeOrg,
    beregningsgrunnlag as bgLønnsendringOgFlereArbeidsforholdISammeOrg
} from './scenario/LønnsendringOgFlereArbeidsforholdISammeOrg';


import {
    behandling as behandlingFlerePerioder,
    beregningsgrunnlag as bgFlerePerioder,
} from './scenario/ForSentRefusjonskravFlereBG';

import { behandling as behandlingKunYtelse, beregningsgrunnlag as bgKunYtelse, } from './scenario/KunYtelse';

import {
    behandling as behandlingKunYtelseVurderingEnPeriode,
    beregningsgrunnlag as bgKunYtelseVurderingEnPeriode,
} from './scenario/KunYtelseEnPeriodeTilVurdering';

import withReduxProvider from '../../../decorators/withRedux';

import alleKodeverk from '../../mocks/alleKodeverk.json';
import arbeidsgivere from '../../mocks/arbeidsgivere.json';

const skjæringstidspunkt = '2020-01-01';

const OPPRETTET_FAKTA_AVKLARING = [
    {
        definisjon: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        status: aksjonspunktStatus.OPPRETTET,
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
    },
];

const behandling = {
    id: 1,
    versjon: 1,
    behandlingsresultat: {
        vilkårResultat: {
            BEREGNINGSGRUNNLAGVILKÅR: [
                {
                    periode: {
                        fom: skjæringstidspunkt,
                    },
                    vurdersIBehandlingen: true,
                },
            ],
        },
    },
};


const lagVilkår = (fomDatoer) => [
    {
        vilkarType: "FP_VK_41",
        perioder: fomDatoer.map(fom => ({ periode: { fom }, vurdersIBehandlingen: true }))
    }];


const lagVilkårAllePerioderVurderes = (bg) => lagVilkår(bg.map(g => g.skjæringstidspunkt))


const lagBehandling = () => ({
    id: 1,
    versjon: 1,
});

const {
    VURDER_MOTTAR_YTELSE,
    VURDER_LONNSENDRING,
    VURDER_NYOPPSTARTET_FL,
    VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
    VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
    VURDER_MILITÆR_SIVILTJENESTE,
    VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
    VURDER_ETTERLONN_SLUTTPAKKE,
    FASTSETT_BG_KUN_YTELSE,
    VURDER_SN_NY_I_ARBEIDSLIVET,
} = faktaOmBeregningTilfelle;

const lagBeregningsgrunnlagAvklarAktiviteter = (aktiviteter, avklaringsbehov, skjæringstidspunkt) => ({
    avklaringsbehov,
    skjæringstidspunkt,
    vilkårsperiodeFom: skjæringstidspunkt,
    faktaOmBeregning: {
        avklarAktiviteter: {
            skjæringstidspunkt,
            aktiviteterTomDatoMapping: [
                {
                    tom: '01.01.2020',
                    aktiviteter,
                },
            ],
        },
        andelerForFaktaOmBeregning: [],
    },
});

const lagAvklaringsbehov = (faktaOmBeregning) => {
    if (!faktaOmBeregning) {
        return [];
    }
    if (faktaOmBeregning.faktaOmBeregningTilfeller && faktaOmBeregning.faktaOmBeregningTilfeller.length > 0) {
        return OPPRETTET_FAKTA_AVKLARING;
    }
    return [];
}

const lagBeregningsgrunnlag = (andeler, faktaOmBeregning, avklaringsbehov) => ({
    avklaringsbehov: avklaringsbehov === null || avklaringsbehov === undefined ? lagAvklaringsbehov(faktaOmBeregning) : avklaringsbehov,
    skjæringstidspunkt,
    vilkårsperiodeFom: skjæringstidspunkt,
    beregningsgrunnlagPeriode: [
        {
            beregningsgrunnlagPrStatusOgAndel: andeler.map(andel => ({
                andelsnr: andel.andelsnr,
                aktivitetStatus: andel.aktivitetStatus,
                inntektskategori: andel.inntektskategori,
                erNyoppstartet: andel.erNyoppstartet,
            })),
        },
    ],
    faktaOmBeregning,
});

const mapTilKodeliste = arrayOfCodes => arrayOfCodes.map(kode => ({ kode }));

const lagAndel = (andelsnr, aktivitetStatus, inntektskategori) => ({
    andelsnr,
    aktivitetStatus: aktivitetStatus,
    inntektskategori: inntektskategori,
});

const standardFaktaArbeidstakerAndel = {
    ...lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
    belopReadOnly: 30000,
    lagtTilAvSaksbehandler: false,
    arbeidsforhold: {
        arbeidsgiverIdent: '123456789',
        arbeidsforholdId: null,
        startdato: '01.01.2019',
        opphoersdato: null,
        arbeidsforholdType: opptjeningAktivitetType.ARBEID,
    },
};
const standardFaktaArbeidstakerAndel2 = {
    ...lagAndel(4, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
    visningsnavn: 'Bedriften2 (12345679)',
    belopReadOnly: 30000,
    lagtTilAvSaksbehandler: false,
    arbeidsforhold: {
        arbeidsgiverIdent: '12345679',
        arbeidsforholdId: null,
        startdato: '01.01.2019',
        opphoersdato: '01.01.2020',
        arbeidsforholdType: opptjeningAktivitetType.ARBEID,
    },
};
const tidsbegrensetFaktaArbeidstakerAndel = {
    ...lagAndel(6, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
    visningsnavn: 'Bedriften3 (12345671)',
    belopReadOnly: 30000,
    lagtTilAvSaksbehandler: false,
    arbeidsforhold: {
        arbeidsgiverIdent: '12345671',
        arbeidsforholdId: null,
        startdato: '01.09.2019',
        opphoersdato: '01.01.2020',
        arbeidsforholdType: opptjeningAktivitetType.ARBEID,
    },
};
const etterlønnSluttpakkeFaktaArbeidstakerAndel = {
    ...lagAndel(7, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
    visningsnavn: 'Bedriften4 (795349533)',
    belopReadOnly: 30000,
    lagtTilAvSaksbehandler: false,
    arbeidsforhold: {
        arbeidsgiverIdent: '795349533',
        arbeidsforholdId: null,
        startdato: '01.09.2019',
        opphoersdato: null,
        arbeidsforholdType: opptjeningAktivitetType.ETTERLONN_SLUTTPAKKE,
    },
};

const standardFaktaFrilansAndel = {
    ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
    belopReadOnly: 10000,
    lagtTilAvSaksbehandler: false,
};
const standardFaktaMilitærAndel = {
    ...lagAndel(5, aktivitetStatuser.MILITAER_ELLER_SIVIL, inntektskategorier.ARBEIDSTAKER),
    belopReadOnly: 10000,
    lagtTilAvSaksbehandler: false,
};
const standardFaktaYtelseAndel = {
    ...lagAndel(8, aktivitetStatuser.KUN_YTELSE, inntektskategorier.UDEFINERT),
    belopReadOnly: 10000,
    lagtTilAvSaksbehandler: false,
};
const standardFaktaNæringAndel = {
    ...lagAndel(9, aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, inntektskategorier.SELVSTENDIG_NAERINGSDRIVENDE),
    belopReadOnly: 10000,
    lagtTilAvSaksbehandler: false,
};
const standardFaktaAAPAndel = {
    ...lagAndel(10, aktivitetStatuser.ARBEIDSAVKLARINGSPENGER, inntektskategorier.ARBEIDSAVKLARINGSPENGER),
    belopReadOnly: 10000,
    lagtTilAvSaksbehandler: false,
};

const merknaderFraBeslutter = {
    notAccepted: false,
};

export default {
    title: 'fakta/fakta-beregning',
    component: BeregningFaktaIndex,
    decorators: [withKnobs, withReduxProvider],
};

export const LønnsendringOgFlereArbeidsforholdISammeOrg = () => (
    <BeregningFaktaIndex
        behandling={behLønnsendringOgFlereArbeidsforholdISammeOrg}
        beregningsgrunnlag={bgLønnsendringOgFlereArbeidsforholdISammeOrg}
        vilkar={lagVilkårAllePerioderVurderes(bgLønnsendringOgFlereArbeidsforholdISammeOrg)}
        erOverstyrer={false}
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
        alleMerknaderFraBeslutter={{}}
        submitCallback={action('button-click')}
        readOnly={boolean('readOnly', false)}
        submittable={boolean('submittable', true)}
    />
);

export const PrivatpersonSomArbeidsgiverOgFrilans = () => (
    <BeregningFaktaIndex
        behandling={behPrivatArbeidsgiver}
        beregningsgrunnlag={bgPrivatArbeidsgiver}
        vilkar={lagVilkårAllePerioderVurderes(bgPrivatArbeidsgiver)}
        erOverstyrer
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
        alleMerknaderFraBeslutter={{
            [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
        }}
        submitCallback={action('button-click')}
        readOnly={boolean('readOnly', false)}
        harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
        submittable={boolean('submittable', true)}
    />
);


export const KunYtelsePåSkjæringstidspunktet = () => (
    <BeregningFaktaIndex
        behandling={behandlingKunYtelse}
        beregningsgrunnlag={bgKunYtelse}
        vilkar={lagVilkårAllePerioderVurderes(bgKunYtelse)}
        erOverstyrer
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
        alleMerknaderFraBeslutter={{
            [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
        }}
        submitCallback={action('button-click')}
        readOnly={boolean('readOnly', false)}
        submittable={boolean('submittable', true)}
    />
);

export const KunYtelsePåSkjæringstidspunktetMedVurderingKunISistePeriode = () => (
    <BeregningFaktaIndex
        behandling={behandlingKunYtelseVurderingEnPeriode}
        beregningsgrunnlag={bgKunYtelseVurderingEnPeriode}
        vilkar={[
            {
                vilkarType: "FP_VK_41",
                perioder: [
                    { periode: { fom: bgKunYtelseVurderingEnPeriode[0].skjæringstidspunkt }, vurdersIBehandlingen: false },
                    { periode: { fom: bgKunYtelseVurderingEnPeriode[1].skjæringstidspunkt }, vurdersIBehandlingen: true },],
            }]}
        erOverstyrer
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
        alleMerknaderFraBeslutter={{
            [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
        }}
        submitCallback={action('button-click')}
        readOnly={boolean('readOnly', false)}
        submittable={boolean('submittable', true)}
    />
);


export const ForSentRefusjonskravOgFlerePerioder = () => (
    <BeregningFaktaIndex
        behandling={behandlingFlerePerioder}
        beregningsgrunnlag={bgFlerePerioder}
        vilkar={lagVilkårAllePerioderVurderes(bgFlerePerioder)}
        erOverstyrer
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
        alleMerknaderFraBeslutter={{
            [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
        }}
        submitCallback={action('button-click')}
        readOnly={boolean('readOnly', false)}
        submittable={boolean('submittable', true)}
    />
);

export const ArbeidOgDagpenger = () => (
    <BeregningFaktaIndex
        behandling={lagBehandling()}
        beregningsgrunnlag={[
            bgMedArbeidOgDagpenger,
            bgMedArbeidOgDagpenger,
        ]}
        vilkar={lagVilkår([bgMedArbeidOgDagpenger.skjæringstidspunkt])}
        erOverstyrer
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
        alleMerknaderFraBeslutter={{
            [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
        }}
        submitCallback={action('button-click')}
        readOnly={boolean('readOnly', false)}
        submittable={boolean('submittable', true)}
    />
);

export const AvklarAktiviteterFullAAPOgAndreAktiviteter = () => {
    const aapAktivitet = {
        arbeidsforholdType: opptjeningAktivitetType.AAP,
        fom: '01-01-2019',
        tom: '01-04-2020',
    };
    const arbeidsAktivitet = {
        ...standardFaktaArbeidstakerAndel.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
    };
    const aktiviteter = [aapAktivitet, arbeidsAktivitet];
    const avklaringsbehov = [
        {
            definisjon: aksjonspunktCodes.AVKLAR_AKTIVITETER,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
        },
    ];

    const stp = '2020-01-01';

    const beregningsgrunnlag = lagBeregningsgrunnlagAvklarAktiviteter(aktiviteter, avklaringsbehov, stp);

    return (
        <BeregningFaktaIndex
            behandling={lagBehandling()}
            beregningsgrunnlag={[
                beregningsgrunnlag,
                beregningsgrunnlag,
            ]}
            vilkar={lagVilkår([stp])}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const AvklartAktiviteterMedAksjonspunktIFaktaAvklaring = () => {
    const aapAktivitet = {
        arbeidsforholdType: opptjeningAktivitetType.AAP,
        fom: '01-01-2019',
        tom: '01-04-2020',
    };
    const arbeidsAktivitet = {
        ...standardFaktaArbeidstakerAndel.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const aktiviteter = [aapAktivitet, arbeidsAktivitet];
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    };
    const aapBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaAAPAndel.andelsnr,
        aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
        inntektskategori: standardFaktaAAPAndel.inntektskategori,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel, aapBeregningsgrunnlagAndel];
    const andelerForFaktaOmBeregning = [standardFaktaArbeidstakerAndel, standardFaktaAAPAndel];
    const refusjonskravSomKommerForSentListe = [
        {
            arbeidsgiverIdent: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsgiverIdent,
        },
    ];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
        refusjonskravSomKommerForSentListe,
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
            aktiviteterTomDatoMapping: [
                {
                    tom: '01-01-2020',
                    aktiviteter,
                },
            ],
        },
    };
    const avklaringsbehov = [
        {
            definisjon: aksjonspunktCodes.AVKLAR_AKTIVITETER,
            status: aksjonspunktStatus.UTFORT,
            begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
            kanLoses: true,
            erAktivt: true,
        },
        {
            definisjon: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
            status: aksjonspunktStatus.OPPRETTET,
            begrunnelse: undefined,
            kanLoses: true,
            erAktivt: true,
        },
    ];
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, avklaringsbehov);
    return (
        <BeregningFaktaIndex
            behandling={lagBehandling()}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const FrilansOgArbeidsforholdMedLønnendringOgNyoppstartet = () => {
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: standardFaktaArbeidstakerAndel.arbeidsforhold,
        lonnsendringIBeregningsperioden: true
    };
    const frilansBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaFrilansAndel.andelsnr,
        aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
        inntektskategori: standardFaktaFrilansAndel.inntektskategori,
        erNyoppstartet: null,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel, frilansBeregningsgrunnlagAndel];
    const andelerForFaktaOmBeregning = [standardFaktaArbeidstakerAndel, standardFaktaFrilansAndel];
    const vurderMottarYtelse = {
        erFrilans: true,
        frilansMottarYtelse: null,
        frilansInntektPrMnd: 20000,
        arbeidstakerAndelerUtenIM: [],
    };
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_LONNSENDRING, VURDER_NYOPPSTARTET_FL, VURDER_MOTTAR_YTELSE]),
        arbeidsforholdMedLønnsendringUtenIM: [arbeidstakerBeregningsgrunnlagAndel],
        vurderMottarYtelse,
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);

    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const KunArbeidstakerMedVurderingSentRefusjonskrav = () => {
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    };
    const arbeidstakerBeregningsgrunnlagAndel2 = {
        andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel, arbeidstakerBeregningsgrunnlagAndel2];
    const andelerForFaktaOmBeregning = [standardFaktaArbeidstakerAndel, standardFaktaArbeidstakerAndel2];
    const refusjonskravSomKommerForSentListe = [
        {
            arbeidsgiverIdent: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsgiverIdent,
        },
    ];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
        refusjonskravSomKommerForSentListe,
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);

    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const FrilansOgArbeidsforholdISammeOrganisasjon = () => {
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: standardFaktaArbeidstakerAndel.arbeidsforhold,
    };
    const frilansBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaFrilansAndel.andelsnr,
        aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
        inntektskategori: standardFaktaFrilansAndel.inntektskategori,
        erNyoppstartet: null,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel, frilansBeregningsgrunnlagAndel];
    const andelerForFaktaOmBeregning = [standardFaktaArbeidstakerAndel, standardFaktaFrilansAndel];
    const vurderMottarYtelse = {
        erFrilans: true,
        frilansMottarYtelse: null,
        frilansInntektPrMnd: 30000,
        arbeidstakerAndelerUtenIM: [],
    };
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE]),
        arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
        vurderMottarYtelse,
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const VurderingAvMilitær = () => {
    const arbeidstakerMilitærAndel = {
        andelsnr: standardFaktaMilitærAndel.andelsnr,
        aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
        inntektskategori: standardFaktaMilitærAndel.inntektskategori,
    };
    const andeler = [arbeidstakerMilitærAndel];
    const andelerForFaktaOmBeregning = [standardFaktaMilitærAndel];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_MILITÆR_SIVILTJENESTE]),
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const FrilansOgTidsbegrensetArbeidsforholdISammeOrganisasjon = () => {
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    };
    const frilansBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaFrilansAndel.andelsnr,
        aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
        inntektskategori: standardFaktaFrilansAndel.inntektskategori,
        erNyoppstartet: null,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel, frilansBeregningsgrunnlagAndel];
    const andelerForFaktaOmBeregning = [tidsbegrensetFaktaArbeidstakerAndel, standardFaktaFrilansAndel];
    const vurderMottarYtelse = {
        erFrilans: true,
        frilansMottarYtelse: null,
        frilansInntektPrMnd: 30000,
        arbeidstakerAndelerUtenIM: [],
    };
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([
            VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
            VURDER_MOTTAR_YTELSE,
            VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
        ]),
        arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
        kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
        vurderMottarYtelse,
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const KunTidsbegrensetArbeidsforhold = () => {
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel];
    const andelerForFaktaOmBeregning = [tidsbegrensetFaktaArbeidstakerAndel];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
        kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const VurderingAvEtterlønnSluttpakke = () => {
    const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
        andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
    };
    const andeler = [etterlønnSluttpakkeBeregningsgrunnlagAndel];
    const andelerForFaktaOmBeregning = [etterlønnSluttpakkeFaktaArbeidstakerAndel];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_ETTERLONN_SLUTTPAKKE]),
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const FastsettingAvBeregningsgrunnlagForKunYtelse = () => {
    const beregningsgrunnlagYtelseAndel = {
        andelsnr: standardFaktaYtelseAndel.andelsnr,
        aktivitetStatus: standardFaktaYtelseAndel.aktivitetStatus,
        inntektskategori: standardFaktaYtelseAndel.inntektskategori,
    };
    const andeler = [beregningsgrunnlagYtelseAndel];
    const andelerForFaktaOmBeregning = [standardFaktaYtelseAndel];
    const kunYtelse = {
        fodendeKvinneMedDP: false,
        andeler,
    };
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([FASTSETT_BG_KUN_YTELSE]),
        andelerForFaktaOmBeregning,
        kunYtelse,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const SelvstendigNæringNyIArbeidslivet = () => {
    const beregningsgrunnlagNæringAndel = {
        andelsnr: standardFaktaNæringAndel.andelsnr,
        aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
        inntektskategori: standardFaktaNæringAndel.inntektskategori,
    };
    const andeler = [beregningsgrunnlagNæringAndel];
    const andelerForFaktaOmBeregning = [standardFaktaNæringAndel];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_SN_NY_I_ARBEIDSLIVET]),
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning, OPPRETTET_FAKTA_AVKLARING);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const KombinasjonstestForFaktapanel = () => {
    const aapAktivitet = {
        arbeidsforholdType: opptjeningAktivitetType.AAP,
        fom: '01-01-2019',
        tom: '01-04-2020',
    };
    const arbeidsAktivitet = {
        ...standardFaktaArbeidstakerAndel.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const arbeidsAktivitet2 = {
        ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const tidsbegrensetarbeidsAktivitet = {
        ...tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const næringAktivitet = {
        arbeidsforholdType: opptjeningAktivitetType.NARING,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const etterlonnSluttpakkeAktivitet = {
        ...etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const frilansAktivitet = {
        arbeidsforholdType: opptjeningAktivitetType.FRILANS,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const militærAktivitet = {
        arbeidsforholdType: opptjeningAktivitetType.MILITAR_ELLER_SIVILTJENESTE,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const aktiviteter = [
        aapAktivitet,
        arbeidsAktivitet,
        arbeidsAktivitet2,
        næringAktivitet,
        tidsbegrensetarbeidsAktivitet,
        etterlonnSluttpakkeAktivitet,
        frilansAktivitet,
        militærAktivitet,
    ];
    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    };
    const arbeidstakerBeregningsgrunnlagAndel2 = {
        andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
        arbeidsforhold: standardFaktaArbeidstakerAndel2.arbeidsforhold,
    };
    const tidsbegrensetarbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    };
    const beregningsgrunnlagNæringAndel = {
        andelsnr: standardFaktaNæringAndel.andelsnr,
        aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
        inntektskategori: standardFaktaNæringAndel.inntektskategori,
    };
    const aapBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaAAPAndel.andelsnr,
        aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
        inntektskategori: standardFaktaAAPAndel.inntektskategori,
    };
    const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
        andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
        arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
    };
    const frilansBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaFrilansAndel.andelsnr,
        aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
        inntektskategori: standardFaktaFrilansAndel.inntektskategori,
        erNyoppstartet: null,
    };
    const militærBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaMilitærAndel.andelsnr,
        aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
        inntektskategori: standardFaktaMilitærAndel.inntektskategori,
    };
    const andeler = [
        arbeidstakerBeregningsgrunnlagAndel,
        arbeidstakerBeregningsgrunnlagAndel2,
        tidsbegrensetarbeidstakerBeregningsgrunnlagAndel,
        beregningsgrunnlagNæringAndel,
        aapBeregningsgrunnlagAndel,
        etterlønnSluttpakkeBeregningsgrunnlagAndel,
        frilansBeregningsgrunnlagAndel,
        militærBeregningsgrunnlagAndel,
    ];
    const andelerForFaktaOmBeregning = [
        standardFaktaArbeidstakerAndel,
        standardFaktaArbeidstakerAndel2,
        tidsbegrensetFaktaArbeidstakerAndel,
        standardFaktaNæringAndel,
        standardFaktaAAPAndel,
        etterlønnSluttpakkeFaktaArbeidstakerAndel,
        standardFaktaFrilansAndel,
        standardFaktaMilitærAndel,
    ];
    const refusjonskravSomKommerForSentListe = [
        {
            arbeidsgiverIdent: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsgiverIdent,
        },
    ];
    const vurderMottarYtelse = {
        erFrilans: true,
        frilansMottarYtelse: null,
        frilansInntektPrMnd: 30000,
        arbeidstakerAndelerUtenIM: [standardFaktaArbeidstakerAndel2],
    };

    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: mapTilKodeliste([
            VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
            VURDER_SN_NY_I_ARBEIDSLIVET,
            VURDER_NYOPPSTARTET_FL,
            VURDER_ETTERLONN_SLUTTPAKKE,
            VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
            VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
            VURDER_MOTTAR_YTELSE,
            VURDER_MILITÆR_SIVILTJENESTE,
        ]),
        refusjonskravSomKommerForSentListe,
        arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel2],
        kortvarigeArbeidsforhold: [tidsbegrensetarbeidstakerBeregningsgrunnlagAndel],
        andelerForFaktaOmBeregning,
        vurderMottarYtelse,
        avklarAktiviteter: {
            skjæringstidspunkt,
            aktiviteterTomDatoMapping: [
                {
                    tom: '01-01-2020',
                    aktiviteter,
                },
            ],
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer={false}
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};

export const OverstyringAvInntekt = () => {
    const arbeidsAktivitet = {
        ...standardFaktaArbeidstakerAndel.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const arbeidsAktivitet2 = {
        ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
        fom: '01-01-2019',
        tom: '01-04-2020',
        skalBrukes: true,
    };
    const aktiviteter = [arbeidsAktivitet, arbeidsAktivitet2];

    const arbeidstakerBeregningsgrunnlagAndel = {
        andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    };
    const arbeidstakerBeregningsgrunnlagAndel2 = {
        andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
        aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
        inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
    };
    const andeler = [arbeidstakerBeregningsgrunnlagAndel, arbeidstakerBeregningsgrunnlagAndel2];
    const andelerForFaktaOmBeregning = [standardFaktaArbeidstakerAndel, standardFaktaArbeidstakerAndel2];
    const faktaOmBeregning = {
        faktaOmBeregningTilfeller: [],
        andelerForFaktaOmBeregning,
        avklarAktiviteter: {
            skjæringstidspunkt,
            aktiviteterTomDatoMapping: [
                {
                    tom: '01-01-2020',
                    aktiviteter,
                },
            ],
        },
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

    return (
        <BeregningFaktaIndex
            behandling={behandling}
            vilkar={lagVilkår([skjæringstidspunkt])}
            beregningsgrunnlag={[beregningsgrunnlag]}
            erOverstyrer
            alleKodeverk={alleKodeverk}
            arbeidsgiverOpplysningerPerId={arbeidsgivere}
            alleMerknaderFraBeslutter={{
                [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
            }}
            submitCallback={action('button-click')}
            readOnly={boolean('readOnly', false)}
            submittable={boolean('submittable', true)}
        />
    );
};
