import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus as AksjonspunktStatus,
  pleiepengerbarn_uttak_kontrakter_AnnenPart as AnnenPart,
  k9_kodeverk_behandling_BehandlingStatus as BehandlingStatus,
  pleiepengerbarn_uttak_kontrakter_Endringsstatus as Endringsstatus,
  k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType,
  pleiepengerbarn_uttak_kontrakter_Utfall as Utfall,
  pleiepengerbarn_uttak_kontrakter_Årsak as Årsak,
  type k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as Aksjonspunkt,
  type k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  type k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  type k9_sak_web_app_tjenester_behandling_uttak_UttaksplanMedUtsattePerioder as UttaksplanMedUtsattePerioder,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import dayjs from 'dayjs';

/**
 * Oppretter en mock behandling (sak) med alle påkrevde felt.
 *
 * @param overrides - Valgfrie overstyringer for spesifikke felt
 * @returns Et komplett BehandlingDto-objekt
 */
export const lagBehandling = (overrides: Partial<BehandlingDto> = {}): BehandlingDto => ({
  versjon: 1,
  uuid: 'behandling-1',
  id: 1,
  status: BehandlingStatus.OPPRETTET,
  sakstype: FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
  opprettet: dayjs().subtract(5, 'day').toISOString(),
  type: 'BT-002',
  ...overrides,
});

/**
 * Oppretter en mock behandling med OPPRETTET-status (nylig opprettet).
 */
export const lagOpprettetBehandling = (overrides: Partial<BehandlingDto> = {}): BehandlingDto =>
  lagBehandling({
    status: BehandlingStatus.OPPRETTET,
    ...overrides,
  });

/**
 * Oppretter en mock behandling med UTREDES-status (under utredning).
 */
export const lagUtredBehandling = (overrides: Partial<BehandlingDto> = {}): BehandlingDto =>
  lagBehandling({
    status: BehandlingStatus.UTREDES,
    ...overrides,
  });

/**
 * Oppretter en mock behandling med AVSLUTTET-status (fullført).
 */
export const lagAvsluttetBehandling = (overrides: Partial<BehandlingDto> = {}): BehandlingDto =>
  lagBehandling({
    status: BehandlingStatus.AVSLUTTET,
    ...overrides,
  });

/**
 * Konfigurasjonsobjekt for å opprette en mock uttaksperiode.
 *
 * @property range - Periodeområde i ISO-format "YYYY-MM-DD/YYYY-MM-DD"
 * @property utfall - Utfall av perioden (OPPFYLT, IKKE_OPPFYLT, etc.)
 * @property uttaksgrad - Uttaksprosent (0-100)
 * @property årsaker - Årsaker til utfallet (f.eks. FULL_DEKNING, AVKORTET_MOT_INNTEKT)
 * @property pleiebehov - Pleiebehovsprosent (0-100)
 * @property annenPart - Status for annen part (ALENE, MED_ANDRE, etc.)
 * @property endringsstatus - Endringsstatus (NY, ENDRET, UENDRET)
 * @property utenlandsoppholdUtenÅrsak - Om det er utenlandsopphold uten årsak
 * @property søkersTapteArbeidstid - Søkers tapte arbeidstidsprosent (0-100)
 * @property utbetalingsgrader - Utbetalingsgrader per arbeidsgiver/aktivitet
 * @property etablertTilsyn - Etablert tilsynsprosent (reduserer tilgjengelig uttak)
 * @property andreSøkeresTilsyn - Andre søkeres tilsynsprosent (reduserer tilgjengelig uttak)
 */
export type PeriodeInit = {
  range: string;
  utfall?: Utfall;
  uttaksgrad?: number;
  årsaker?: Årsak[];
  pleiebehov?: number;
  annenPart?: AnnenPart;
  endringsstatus?: Endringsstatus;
  utenlandsoppholdUtenÅrsak?: boolean;
  søkersTapteArbeidstid?: number;
  utbetalingsgrader?: Array<{
    arbeidsforhold: { type: string; organisasjonsnummer?: string; aktørId?: string };
    normalArbeidstid: string;
    faktiskArbeidstid: string;
    utbetalingsgrad: number;
    tilkommet: boolean;
  }>;
  etablertTilsyn?: number;
  andreSøkeresTilsyn?: number;
  manueltOverstyrt?: boolean;
};

/**
 * Oppretter en mock uttaksplan med perioder.
 *
 * Denne funksjonen genererer en komplett uttaksplan med alle påkrevde felt for testing.
 * Den beregner automatisk graderingMotTilsyn basert på etablertTilsyn
 * og andreSøkeresTilsyn-verdier.
 *
 * Eksempel på bruk:
 * ```typescript
 * const uttak = lagUttak([
 *   lagOppfyltPeriode('2024-01-01/2024-01-15'),
 *   lagInntektsgraderingPeriode('2024-01-16/2024-01-31', 80, [
 *     { orgnr: '123456789', utbetalingsgrad: 80 }
 *   ])
 * ]);
 * ```
 *
 * @param perioder - Array av periodekonfigurasjoner opprettet med hjelpefunksjoner
 * @param extra - Valgfrie tilleggsfelt (f.eks. virkningsdatoUttakNyeRegler)
 * @returns Et komplett UttaksplanMedUtsattePerioder-objekt med alle påkrevde felt
 */
export const lagUttak = (
  perioder: PeriodeInit[],
  extra: Partial<UttaksplanMedUtsattePerioder> = {},
): UttaksplanMedUtsattePerioder => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const perioderMap: Record<string, any> = {};
  perioder.forEach(p => {
    // Beregn tilgjengelig uttaksprosent etter å ha trukket fra tilsynsdekning
    const tilgjengeligForSøker = 100 - (p.etablertTilsyn ?? 0) - (p.andreSøkeresTilsyn ?? 0);

    // Bestem inngangsvilkår basert på utfall og årsaker
    const harInngangsvilkårIkkeOppfylt =
      p.utfall === Utfall.IKKE_OPPFYLT && p.årsaker?.includes(Årsak.INNGANGSVILKÅR_IKKE_OPPFYLT);

    const inngangsvilkår = harInngangsvilkårIkkeOppfylt
      ? {
          FP_VK_2: Utfall.OPPFYLT,
          FP_VK_3: Utfall.OPPFYLT,
          K9_VK_1: Utfall.IKKE_OPPFYLT, // Sett minst ett vilkår til ikke oppfylt
          K9_VK_3: Utfall.OPPFYLT,
          FP_VK_21: Utfall.OPPFYLT,
          FP_VK_23: Utfall.OPPFYLT,
          FP_VK_34: Utfall.OPPFYLT,
          K9_VK_2_a: Utfall.OPPFYLT,
        }
      : {
          FP_VK_2: Utfall.OPPFYLT,
          FP_VK_3: Utfall.OPPFYLT,
          K9_VK_1: Utfall.OPPFYLT,
          K9_VK_3: Utfall.OPPFYLT,
          FP_VK_21: Utfall.OPPFYLT,
          FP_VK_23: Utfall.OPPFYLT,
          FP_VK_34: Utfall.OPPFYLT,
          K9_VK_2_a: Utfall.OPPFYLT,
        };

    perioderMap[p.range] = {
      utfall: p.utfall ?? Utfall.OPPFYLT,
      uttaksgrad: p.uttaksgrad ?? 100,
      utbetalingsgrader: p.utbetalingsgrader ?? [
        {
          arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: '123456789' },
          normalArbeidstid: 'PT7H30M',
          faktiskArbeidstid: 'PT0S',
          utbetalingsgrad: p.uttaksgrad ?? 100,
          tilkommet: false,
        },
      ],
      søkersTapteArbeidstid: p.søkersTapteArbeidstid ?? 100,
      årsaker: p.årsaker ?? [],
      inngangsvilkår,
      pleiebehov: p.pleiebehov ?? 100,
      graderingMotTilsyn: {
        etablertTilsyn: p.etablertTilsyn ?? 0,
        andreSøkeresTilsyn: p.andreSøkeresTilsyn ?? 0,
        tilgjengeligForSøker,
      },
      knekkpunktTyper: [],
      kildeBehandlingUUID: 'behandling-1',
      annenPart: p.annenPart ?? AnnenPart.ALENE,
      endringsstatus: p.endringsstatus ?? Endringsstatus.NY,
      utenlandsoppholdUtenÅrsak: p.utenlandsoppholdUtenÅrsak ?? false,
      manueltOverstyrt: p.manueltOverstyrt ?? false,
    };
  });

  // Generer perioderTilVurdering fra periodene
  const perioderTilVurdering = perioder.map(p => p.range);

  return {
    uttaksplan: { perioder: perioderMap },
    simulertUttaksplan: {},
    perioderTilVurdering,
    ...extra,
  } as UttaksplanMedUtsattePerioder;
};

/**
 * Oppretter en periode med OPPFYLT-status.
 */
export const lagOppfyltPeriode = (range: string, overrides: Partial<PeriodeInit> = {}): PeriodeInit => ({
  range,
  utfall: Utfall.OPPFYLT,
  uttaksgrad: 100,
  årsaker: [Årsak.FULL_DEKNING],
  ...overrides,
});

/**
 * Oppretter en periode med IKKE_OPPFYLT-status.
 */
export const lagIkkeOppfyltPeriode = (
  range: string,
  årsaker: Årsak[],
  overrides: Partial<PeriodeInit> = {},
): PeriodeInit => ({
  range,
  utfall: Utfall.IKKE_OPPFYLT,
  uttaksgrad: 0,
  årsaker,
  ...overrides,
});

/**
 * Oppretter en periode med inntektsgradering.
 *
 * Inntektsgradering reduserer uttaksgraden når søker arbeider i perioden.
 * Uttaksgraden representerer prosentandelen av ytelser mottatt, mens den resterende
 * prosentandelen representerer arbeidsaktivitet.
 *
 * Eksempel: 70% uttaksgrad betyr 70% ytelser + 30% arbeid
 *
 * Funksjonen beregner automatisk faktiskArbeidstid basert på utbetalingsgraden
 * for hver arbeidsgiver, med antagelse om en normal arbeidsdag på 7,5 timer.
 *
 * @param range - Periodeområde i ISO-format "YYYY-MM-DD/YYYY-MM-DD"
 * @param uttaksgrad - Total uttaksprosent (0-100)
 * @param arbeidsgivere - Array av arbeidsgivere med deres utbetalingsgrader
 * @param overrides - Valgfrie overstyringer for andre periodefelt
 * @returns PeriodeInit-konfigurasjon med inntektsgradering
 */
export const lagInntektsgraderingPeriode = (
  range: string,
  uttaksgrad: number,
  arbeidsgivere: Array<{ orgnr: string; utbetalingsgrad: number; tilkommet?: boolean }>,
  overrides: Partial<PeriodeInit> = {},
): PeriodeInit => ({
  range,
  utfall: Utfall.OPPFYLT,
  uttaksgrad,
  søkersTapteArbeidstid: uttaksgrad, // Tapt arbeidstid matcher uttaksgraden
  årsaker: [Årsak.AVKORTET_MOT_INNTEKT],
  utbetalingsgrader: arbeidsgivere.map(ag => ({
    arbeidsforhold: { type: 'ARBEIDSTAKER', organisasjonsnummer: ag.orgnr },
    normalArbeidstid: 'PT7H30M', // 7,5 timer normal arbeidsdag
    // Beregn faktisk arbeidstid: (7,5 timer * arbeidsprosent) konvertert til minutter
    faktiskArbeidstid: `PT${Math.round(((7.5 * (100 - ag.utbetalingsgrad)) / 100) * 60)}M`,
    utbetalingsgrad: ag.utbetalingsgrad,
    tilkommet: ag.tilkommet ?? false, // tilkommet = ny ansettelse i perioden
  })),
  ...overrides,
});

/**
 * Oppretter en periode med tilsynsgradering (graderingMotTilsyn).
 *
 * Tilsynsgradering reduserer tilgjengelig uttaksgrad når det er etablert tilsyn
 * eller når andre søkere også mottar omsorgsytelser for
 * samme barn (andreSøkeresTilsyn).
 *
 * Beregningen er: tilgjengeligForSøker = 100% - etablertTilsyn - andreSøkeresTilsyn
 *
 * Eksempel: Hvis det er 30% etablert tilsyn og 20% andre søkeres tilsyn,
 * er kun 50% tilgjengelig for denne søkeren.
 *
 * @param range - Periodeområde i ISO-format "YYYY-MM-DD/YYYY-MM-DD"
 * @param etablertTilsyn - Etablert tilsynsprosent (0-100)
 * @param andreSøkeresTilsyn - Andre søkeres tilsynsprosent (0-100)
 * @param overrides - Valgfrie overstyringer for andre periodefelt
 * @returns PeriodeInit-konfigurasjon med tilsynsgradering
 */
export const lagTilsynsgraderingPeriode = (
  range: string,
  etablertTilsyn: number,
  andreSøkeresTilsyn: number,
  overrides: Partial<PeriodeInit> = {},
): PeriodeInit => {
  // Beregn tilgjengelig uttak etter å ha trukket fra tilsynsdekning
  const tilgjengeligForSøker = 100 - etablertTilsyn - andreSøkeresTilsyn;
  return {
    range,
    utfall: Utfall.OPPFYLT,
    uttaksgrad: tilgjengeligForSøker,
    årsaker: [Årsak.GRADERT_MOT_TILSYN],
    etablertTilsyn,
    andreSøkeresTilsyn,
    ...overrides,
  };
};

/**
 * Oppretter et mock aksjonspunkt med alle påkrevde felt.
 *
 * @param definisjon - Aksjonspunktets definisjonskode
 * @param status - Aksjonspunktets status (standard: OPPRETTET)
 * @param overrides - Valgfrie overstyringer for spesifikke felt
 * @returns Et komplett Aksjonspunkt-objekt
 */
export const lagAksjonspunkt = (
  definisjon: AksjonspunktDefinisjon,
  status: AksjonspunktStatus = AksjonspunktStatus.OPPRETTET,
  overrides: Partial<Aksjonspunkt> = {},
): Aksjonspunkt => ({
  definisjon,
  status,
  begrunnelse: overrides.begrunnelse,
  toTrinnsBehandling: false,
  kanLoses: status === AksjonspunktStatus.OPPRETTET,
  erAktivt: status === AksjonspunktStatus.OPPRETTET,
  fristTid: undefined,
  vilkarType: undefined,
  aksjonspunktType: 'MANU',
  besluttersBegrunnelse: undefined,
  vurderPaNyttArsaker: undefined,
  venteårsak: '-',
  venteårsakVariant: undefined,
  opprettetAv: 'vtp',
  ...overrides,
});

/**
 * Oppretter et uløst aksjonspunkt.
 * Dette representerer et aksjonspunkt som må løses av saksbehandler.
 */
export const lagUløstAksjonspunkt = (
  definisjon: AksjonspunktDefinisjon,
  overrides: Partial<Aksjonspunkt> = {},
): Aksjonspunkt =>
  lagAksjonspunkt(definisjon, AksjonspunktStatus.OPPRETTET, {
    kanLoses: true,
    erAktivt: true,
    begrunnelse: undefined,
    ...overrides,
  });

/**
 * Oppretter et løst aksjonspunkt.
 * Dette representerer et aksjonspunkt som har blitt løst.
 */
export const lagLøstAksjonspunkt = (
  definisjon: AksjonspunktDefinisjon,
  begrunnelse: string,
  overrides: Partial<Aksjonspunkt> = {},
): Aksjonspunkt =>
  lagAksjonspunkt(definisjon, AksjonspunktStatus.UTFØRT, {
    kanLoses: false,
    erAktivt: false,
    begrunnelse,
    ...overrides,
  });

/**
 * Oppretter et aksjonspunkt for overstyring av uttak.
 */
export const lagOverstyringUttakAksjonspunkt = (
  status: AksjonspunktStatus = AksjonspunktStatus.OPPRETTET,
  overrides: Partial<Aksjonspunkt> = {},
): Aksjonspunkt => lagAksjonspunkt(AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK, status, overrides);

/**
 * Oppretter et aksjonspunkt for vurdering av overlappende søskensaker.
 */
export const lagOverlappendeSakerAksjonspunkt = (
  status: AksjonspunktStatus = AksjonspunktStatus.OPPRETTET,
  overrides: Partial<Aksjonspunkt> = {},
): Aksjonspunkt => lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER, status, overrides);

/**
 * Oppretter et aksjonspunkt for vurdering av dato for nye uttaksregler.
 */
export const lagVurderDatoNyRegelAksjonspunkt = (
  status: AksjonspunktStatus = AksjonspunktStatus.OPPRETTET,
  overrides: Partial<Aksjonspunkt> = {},
): Aksjonspunkt => lagAksjonspunkt(AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK, status, overrides);

/**
 * Alle relevante aksjonspunktdefinisjoner for uttak.
 */
export const relevanteAksjonspunkterAlle: AksjonspunktDefinisjon[] = [
  AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
  AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
  AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
  AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
];

/**
 * Oppretter mock arbeidsgivere-data.
 *
 * @param arbeidsgivere - Array av arbeidsgiverkonfigurasjoner
 * @returns ArbeidsgiverOversiktDto arbeidsgivere-objekt
 */
export const lagArbeidsgivere = (
  arbeidsgivere: Array<{
    identifikator: string;
    navn: string;
    arbeidsforholdreferanser?: Array<{
      internArbeidsforholdId: string;
      eksternArbeidsforholdId: string;
    }>;
  }>,
): ArbeidsgiverOversiktDto['arbeidsgivere'] => {
  const result: ArbeidsgiverOversiktDto['arbeidsgivere'] = {};

  arbeidsgivere.forEach(ag => {
    result[ag.identifikator] = {
      identifikator: ag.identifikator,
      navn: ag.navn,
      arbeidsforholdreferanser: ag.arbeidsforholdreferanser ?? [],
    };
  });

  return result;
};

/**
 * Standard mock arbeidsgivere for testing.
 * Inkluderer to arbeidsgivere med forskjellige organisasjonsnummer.
 *
 * Merk: Når du bruker dette i handlers eller andre funksjoner, sørg for at du ikke
 * modifiserer objektet direkte. Bruk spread-operator eller lag kopier når nødvendig.
 */
export const defaultArbeidsgivere = lagArbeidsgivere([
  {
    identifikator: '123456789',
    navn: 'Bedrift AS',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'aaaaa-bbbbb',
        eksternArbeidsforholdId: 'ref-1',
      },
    ],
  },
  {
    identifikator: '987654321',
    navn: 'Annen Bedrift AS',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'ccccc-ddddd',
        eksternArbeidsforholdId: 'ref-2',
      },
    ],
  },
]);

/**
 * Mock arbeidsgivere med en ny arbeidsgiver (tilkommet).
 * Nyttig for testing av inntektsgraderingsscenarier med ny ansettelse.
 *
 * Merk: Når du bruker dette i handlers eller andre funksjoner, sørg for at du ikke
 * modifiserer objektet direkte. Bruk spread-operator eller lag kopier når nødvendig.
 */
export const arbeidsgivereWithTilkommet = lagArbeidsgivere([
  {
    identifikator: '123456789',
    navn: 'Bedrift AS',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'aaaaa-bbbbb',
        eksternArbeidsforholdId: 'ref-1',
      },
    ],
  },
  {
    identifikator: '987654321',
    navn: 'Annen Bedrift AS',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'ccccc-ddddd',
        eksternArbeidsforholdId: 'ref-2',
      },
    ],
  },
  {
    identifikator: '555666777',
    navn: 'Ny Bedrift AS (tilkommet)',
    arbeidsforholdreferanser: [
      {
        internArbeidsforholdId: 'eeeee-fffff',
        eksternArbeidsforholdId: 'ref-3',
      },
    ],
  },
]);

/**
 * Oppretter mock inntektsgradering data for en periode.
 *
 * @param range - Periodeområde i ISO-format "YYYY-MM-DD/YYYY-MM-DD"
 * @param inntektsforhold - Array av inntektsforhold med arbeidsgivere
 * @param beregningsgrunnlag - Total beregningsgrunnlag (sum av alle bruttoInntekter)
 * @returns InntektgraderingPeriodeDto-objekt
 */
export const lagInntektgraderingPeriodeDto = (
  range: string,
  inntektsforhold: Array<{
    arbeidsgiverIdentifikator?: string;
    arbeidstidprosent: number;
    bruttoInntekt: number;
    erNytt?: boolean;
    type?: string;
  }>,
  beregningsgrunnlag?: number,
) => {
  const [fom, tom] = range.split('/');

  // Beregn beregningsgrunnlag hvis ikke oppgitt (sum av alle bruttoInntekter som ikke er nye)
  const calculatedBeregningsgrunnlag =
    beregningsgrunnlag ?? inntektsforhold.filter(i => !i.erNytt).reduce((sum, i) => sum + i.bruttoInntekt, 0);

  // Beregn løpende inntekt (bruttoInntekt * arbeidstidprosent / 100)
  const løpendeInntekt = inntektsforhold.reduce((sum, i) => sum + (i.bruttoInntekt * i.arbeidstidprosent) / 100, 0);

  // Beregn bortfalt inntekt
  const bortfaltInntekt = calculatedBeregningsgrunnlag - løpendeInntekt;

  // Beregn reduksjonsprosent (løpende / beregningsgrunnlag * 100)
  const reduksjonsProsent = Math.round((løpendeInntekt / calculatedBeregningsgrunnlag) * 100);

  // Beregn graderingsprosent (bortfalt / beregningsgrunnlag * 100)
  const graderingsProsent = Math.round((bortfaltInntekt / calculatedBeregningsgrunnlag) * 100);

  return {
    periode: { fom, tom },
    beregningsgrunnlag: calculatedBeregningsgrunnlag,
    løpendeInntekt,
    bortfaltInntekt,
    reduksjonsProsent,
    graderingsProsent,
    inntektsforhold: inntektsforhold.map(i => ({
      arbeidsgiverIdentifikator: i.arbeidsgiverIdentifikator,
      arbeidstidprosent: i.arbeidstidprosent,
      bruttoInntekt: i.bruttoInntekt,
      løpendeInntekt: (i.bruttoInntekt * i.arbeidstidprosent) / 100,
      erNytt: i.erNytt ?? false,
      type: i.type ?? 'ARBEIDSTAKER',
    })),
  };
};

/**
 * Mock inntektsgradering data for story med én arbeidsgiver.
 * Demonstrerer 70% uttak (30% arbeid).
 *
 * Merk: Når du bruker dette i handlers eller andre funksjoner, sørg for at du ikke
 * modifiserer objektet direkte. Bruk spread-operator eller lag kopier når nødvendig.
 */
export const inntektsgraderingEnArbeidsgiver = {
  perioder: [
    lagInntektgraderingPeriodeDto(
      '2024-01-01/2024-01-15',
      [
        {
          arbeidsgiverIdentifikator: '123456789',
          arbeidstidprosent: 30,
          bruttoInntekt: 500000,
          erNytt: false,
          type: 'ARBEIDSTAKER',
        },
      ],
      500000,
    ),
  ],
};

/**
 * Mock inntektsgradering data for story med flere arbeidsgivere.
 * Demonstrerer:
 * - Periode 1: 70% uttak med én arbeidsgiver
 * - Periode 2: 50% uttak med to eksisterende arbeidsgivere + én ny (tilkommet)
 * - Periode 3: 40% uttak med to arbeidsgivere (én tilkommet)
 *
 * Merk: Når du bruker dette i handlers eller andre funksjoner, sørg for at du ikke
 * modifiserer objektet direkte. Bruk spread-operator eller lag kopier når nødvendig.
 */
export const inntektsgraderingFlereArbeidsgivere = {
  perioder: [
    lagInntektgraderingPeriodeDto(
      '2024-01-01/2024-01-15',
      [
        {
          arbeidsgiverIdentifikator: '123456789',
          arbeidstidprosent: 30,
          bruttoInntekt: 500000,
          erNytt: false,
          type: 'ARBEIDSTAKER',
        },
      ],
      500000,
    ),
    lagInntektgraderingPeriodeDto(
      '2024-01-16/2024-01-31',
      [
        {
          arbeidsgiverIdentifikator: '123456789',
          arbeidstidprosent: 25,
          bruttoInntekt: 300000,
          erNytt: false,
          type: 'ARBEIDSTAKER',
        },
        {
          arbeidsgiverIdentifikator: '987654321',
          arbeidstidprosent: 25,
          bruttoInntekt: 200000,
          erNytt: false,
          type: 'ARBEIDSTAKER',
        },
        {
          arbeidsgiverIdentifikator: '555666777',
          arbeidstidprosent: 50,
          bruttoInntekt: 250000,
          erNytt: true,
          type: 'ARBEIDSTAKER',
        },
      ],
      500000,
    ),
    lagInntektgraderingPeriodeDto(
      '2024-02-01/2024-02-14',
      [
        {
          arbeidsgiverIdentifikator: '123456789',
          arbeidstidprosent: 40,
          bruttoInntekt: 300000,
          erNytt: false,
          type: 'ARBEIDSTAKER',
        },
        {
          arbeidsgiverIdentifikator: '555666777',
          arbeidstidprosent: 60,
          bruttoInntekt: 300000,
          erNytt: true,
          type: 'ARBEIDSTAKER',
        },
      ],
      500000,
    ),
  ],
};

/**
 * Oppretter mock-data for en overlappende periode.
 *
 * Overlappende perioder oppstår når flere saker for samme barn har perioder
 * som overlapper i tid. Disse må vurderes av saksbehandler for å sikre at
 * total uttaksgrad ikke overstiger 100%.
 *
 * Funksjonen kopierer saksnummer-arrayet for å sikre immutability og
 * dataisolasjon mellom tester.
 *
 * @example
 * ```typescript
 * // Uløst overlappende periode
 * const periode = lagOverlappendePeriode(
 *   '2024-01-01',
 *   '2024-01-15',
 *   ['SAK123', 'SAK456'],
 *   { skalVurderes: true }
 * );
 *
 * // Løst overlappende periode
 * const løstPeriode = lagOverlappendePeriode(
 *   '2024-01-16',
 *   '2024-01-31',
 *   ['SAK123', 'SAK456'],
 *   {
 *     skalVurderes: false,
 *     fastsattUttaksgrad: 50,
 *     saksbehandler: 'Z123456',
 *     vurdertTidspunkt: '2024-01-10T10:00:00',
 *     valg: 'VELG_SAK_123'
 *   }
 * );
 * ```
 *
 * @param fom - Start-dato (ISO-format YYYY-MM-DD eller dayjs-objekt)
 * @param tom - Slutt-dato (ISO-format YYYY-MM-DD eller dayjs-objekt)
 * @param saksnummer - Array av saksnummer som overlapper (kopieres for immutability)
 * @param options - Valgfrie tilleggsfelt
 * @param options.skalVurderes - Om perioden skal vurderes (default: true)
 * @param options.fastsattUttaksgrad - Fastsatt uttaksgrad etter vurdering (0-100)
 * @param options.saksbehandler - Saksbehandler som har vurdert perioden
 * @param options.vurdertTidspunkt - Tidspunkt for vurdering (ISO-format)
 * @param options.valg - Valg gjort av saksbehandler
 * @returns Overlappende periode-objekt med kopiert saksnummer-array
 */
export const lagOverlappendePeriode = (
  fom: string | dayjs.Dayjs,
  tom: string | dayjs.Dayjs,
  saksnummer: string[],
  options: {
    skalVurderes?: boolean;
    fastsattUttaksgrad?: number;
    saksbehandler?: string;
    vurdertTidspunkt?: string;
    valg?: string;
  } = {},
) => {
  const fomStr = typeof fom === 'string' ? fom : fom.format('YYYY-MM-DD');
  const tomStr = typeof tom === 'string' ? tom : tom.format('YYYY-MM-DD');

  return {
    periode: { fom: fomStr, tom: tomStr },
    skalVurderes: options.skalVurderes ?? true,
    saksnummer: [...saksnummer], // Kopier array for immutability
    ...(options.fastsattUttaksgrad !== undefined && {
      fastsattUttaksgrad: options.fastsattUttaksgrad,
    }),
    ...(options.saksbehandler && { saksbehandler: options.saksbehandler }),
    ...(options.vurdertTidspunkt && { vurdertTidspunkt: options.vurdertTidspunkt }),
    ...(options.valg && { valg: options.valg }),
  };
};

/**
 * Oppretter mock-data for en overstyring av uttak.
 *
 * Overstyringer brukes når saksbehandler manuelt justerer uttaksgrader
 * for en periode, typisk for å korrigere automatiske beregninger eller
 * håndtere spesielle situasjoner.
 *
 * Funksjonen lager dype kopier av utbetalingsgrader for å sikre
 * immutability og dataisolasjon mellom tester.
 *
 * @example
 * ```typescript
 * // Overstyring med én arbeidsgiver
 * const overstyring = lagOverstyring(
 *   1,
 *   '2024-01-01',
 *   '2024-01-15',
 *   80,
 *   'Søker har redusert arbeidstid',
 *   [
 *     {
 *       arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
 *       utbetalingsgrad: 80
 *     }
 *   ]
 * );
 *
 * // Overstyring med flere arbeidsgivere
 * const kompleksOverstyring = lagOverstyring(
 *   2,
 *   '2024-01-16',
 *   '2024-01-31',
 *   60,
 *   'Fordeling mellom arbeidsgivere',
 *   [
 *     {
 *       arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '123456789' },
 *       utbetalingsgrad: 40
 *     },
 *     {
 *       arbeidsforhold: { type: 'ARBEIDSTAKER', orgnr: '987654321' },
 *       utbetalingsgrad: 20
 *     }
 *   ]
 * );
 * ```
 *
 * @param id - Unik ID for overstyringen
 * @param fom - Start-dato (ISO-format YYYY-MM-DD)
 * @param tom - Slutt-dato (ISO-format YYYY-MM-DD)
 * @param søkersUttaksgrad - Søkers totale uttaksgrad (0-100)
 * @param begrunnelse - Begrunnelse for overstyringen
 * @param utbetalingsgrader - Array av utbetalingsgrader per arbeidsgiver (kopieres for immutability)
 * @returns Overstyring-objekt med dypt kopierte utbetalingsgrader
 */
export const lagOverstyring = (
  id: number,
  fom: string,
  tom: string,
  søkersUttaksgrad: number,
  begrunnelse: string,
  utbetalingsgrader: Array<{
    arbeidsforhold: { type: string; orgnr: string };
    utbetalingsgrad: number;
  }>,
) => ({
  id,
  periode: { fom, tom },
  søkersUttaksgrad,
  begrunnelse,
  // Deep copy av utbetalingsgrader for immutability
  utbetalingsgrader: utbetalingsgrader.map(ug => ({
    arbeidsforhold: { ...ug.arbeidsforhold },
    utbetalingsgrad: ug.utbetalingsgrad,
  })),
});

export {
  AksjonspunktDefinisjon,
  AksjonspunktStatus,
  AnnenPart,
  BehandlingStatus,
  Endringsstatus,
  FagsakYtelseType,
  Utfall,
  Årsak,
};
