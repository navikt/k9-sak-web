import { faktaPanelCodes } from './faktaPanelCodes.js';
import { prosessStegCodes } from './prosessStegCodes.js';
import tabCodes from '../../fakta/sykdom-og-opplæring/tabCodes.js';
import { SkjermlenkeType } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/SkjermlenkeType.js';

// Pga midlertidig workaround for manglande SkjermlenkeType definisjon i backend legger vi til denne her.
// Skal fjernast igjen når backend implementerer disse koder.
const extraSkjermlenkeType = {
  FAKTA_OM_NY_INNTEKT: 'FAKTA_OM_NY_INNTEKT',
  FAKTA_OM_SOKNADSPERIODER: 'FAKTA_OM_SOKNADSPERIODER',
} as const;

export type SkjermlenkeTypeWithExtraCodes =
  | SkjermlenkeType
  | (typeof extraSkjermlenkeType)[keyof typeof extraSkjermlenkeType];

type SkjermlenkeCode = Readonly<{
  kode: SkjermlenkeTypeWithExtraCodes;
  faktaNavn: (typeof faktaPanelCodes)[keyof typeof faktaPanelCodes];
  punktNavn: (typeof prosessStegCodes)[keyof typeof prosessStegCodes];
  tabNavn?: (typeof tabCodes)[keyof typeof tabCodes];
}>;

const skjermlenkeCodes: SkjermlenkeCode[] = [
  {
    kode: extraSkjermlenkeType.FAKTA_OM_NY_INNTEKT,
    faktaNavn: faktaPanelCodes.NY_INNTEKT,
    punktNavn: '',
  },
  {
    kode: extraSkjermlenkeType.FAKTA_OM_SOKNADSPERIODER,
    faktaNavn: faktaPanelCodes.SOKNADSPERIODER,
    punktNavn: '',
  },

  {
    kode: SkjermlenkeType.BEREGNING,
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.BEREGNINGSGRUNNLAG,
  },
  {
    kode: SkjermlenkeType.FAKTA_OM_BEREGNING,
    faktaNavn: faktaPanelCodes.BEREGNING,
    punktNavn: '',
  },
  {
    kode: SkjermlenkeType.FAKTA_OM_FORDELING,
    faktaNavn: faktaPanelCodes.FORDELING,
    punktNavn: '',
  },
  {
    kode: 'FAKTA_OM_MEDLEMSKAP',
    faktaNavn: faktaPanelCodes.MEDLEMSKAPSVILKARET,
    punktNavn: '',
  },
  {
    kode: 'FAKTA_FOR_OPPTJENING',
    faktaNavn: faktaPanelCodes.OPPTJENINGSVILKARET,
    punktNavn: '',
  },
  {
    kode: 'FAKTA_OM_OPPTJENING',
    faktaNavn: faktaPanelCodes.OPPTJENINGSVILKARET,
    punktNavn: '',
  },
  {
    kode: 'FAKTA_OM_ARBEIDSFORHOLD',
    faktaNavn: faktaPanelCodes.ARBEIDSFORHOLD,
    punktNavn: '',
  },
  {
    kode: 'KLAGE_BEH_NFP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.KLAGE_NAV_FAMILIE_OG_PENSJON,
  },
  {
    kode: 'KLAGE_BEH_NK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.KLAGE_NAV_KLAGEINSTANS,
  },
  {
    kode: 'FORMKRAV_KLAGE_NFP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON,
  },
  {
    kode: 'FORMKRAV_KLAGE_KA',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORMKRAV_KLAGE_NAV_KLAGEINSTANS,
  },
  {
    kode: 'KONTROLL_AV_SAKSOPPLYSNINGER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.SAKSOPPLYSNINGER,
  },
  {
    kode: 'OPPLYSNINGSPLIKT',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.OPPLYSNINGSPLIKT,
  },
  {
    kode: 'PUNKT_FOR_MEDLEMSKAP',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.OPPTJENING,
  },
  {
    kode: 'PUNKT_FOR_MEDISINSK',
    faktaNavn: prosessStegCodes.PUNKT_FOR_MEDISINSK,
    punktNavn: faktaPanelCodes.DEFAULT,
  },
  {
    kode: 'PUNKT_FOR_OPPTJENING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.OPPTJENING,
  },
  {
    kode: 'SOEKNADSFRIST',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  {
    kode: 'VEDTAK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.VEDTAK,
  },
  {
    kode: 'FAKTA_OM_UTTAK',
    faktaNavn: faktaPanelCodes.UTTAK,
    punktNavn: '',
  },
  {
    kode: 'UTTAK',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.UTTAK,
  },
  {
    kode: 'FAKTA_OM_UTVIDETRETT',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.UTVIDET_RETT,
  },
  {
    kode: SkjermlenkeType.FAKTA_OM_OMSORGENFOR,
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.INNGANGSVILKAR,
  },
  {
    kode: SkjermlenkeType.PUNKT_FOR_ALDERSVILKÅR_BARN,
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.ALDER,
  },
  {
    kode: 'FAKTA_OM_VERGE',
    faktaNavn: faktaPanelCodes.VERGE,
    punktNavn: '',
  },
  {
    kode: 'TILKJENT_YTELSE',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.TILKJENT_YTELSE,
  },
  {
    kode: 'FAKTA_OM_SIMULERING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.SIMULERING,
  },
  {
    kode: 'FAKTA_OM_FEILUTBETALING',
    faktaNavn: faktaPanelCodes.FEILUTBETALING,
    punktNavn: '',
  },
  {
    kode: 'UTLAND',
    faktaNavn: faktaPanelCodes.SAKEN,
    punktNavn: '',
  },
  {
    kode: 'FORELDELSE',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORELDELSE,
  },
  {
    kode: 'TILBAKEKREVING',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.TILBAKEKREVING,
  },
  {
    kode: 'VURDER_FARESIGNALER',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: '',
  },
  {
    kode: 'PUNKT_FOR_MEDLEMSKAP_LØPENDE',
    faktaNavn: faktaPanelCodes.DEFAULT,
    punktNavn: prosessStegCodes.FORTSATTMEDLEMSKAP,
  },
  {
    kode: 'FAKTA_OM_MEDISINSK',
    faktaNavn: faktaPanelCodes.MEDISINSKVILKAAR_V2,
    punktNavn: prosessStegCodes.MEDISINSK_VILKAR,
  },
  {
    kode: 'FAKTA_OM_ÅRSKVANTUM',
    faktaNavn: faktaPanelCodes.NØKKELTALL,
    punktNavn: prosessStegCodes.UTTAK,
  },
  {
    kode: 'PUNKT_FOR_MAN_VILKÅRSVURDERING',
    faktaNavn: '',
    punktNavn: prosessStegCodes.UNNTAK,
  },
  {
    kode: 'VURDER_BEREDSKAP',
    faktaNavn: faktaPanelCodes.ETABLERT_TILSYN,
    punktNavn: '',
  },
  {
    kode: 'VURDER_NATTEVÅK',
    faktaNavn: faktaPanelCodes.ETABLERT_TILSYN,
    punktNavn: '',
  },
  {
    kode: 'INFOTRYGD_MIGRERING',
    faktaNavn: faktaPanelCodes.INFOTRYGDMIGRERING,
    punktNavn: '',
  },
  {
    kode: 'OVERSTYR_INPUT_BEREGNING',
    faktaNavn: faktaPanelCodes.OVERSTYRING,
    punktNavn: '',
  },
  {
    kode: 'FAKTA_OM_NYOPPSTARTET',
    faktaNavn: faktaPanelCodes.NYOPPSTARTET,
    punktNavn: prosessStegCodes.DEFAULT,
  },
  {
    kode: 'PUNKT_FOR_INSTITUSJON',
    faktaNavn: faktaPanelCodes.SYKDOM_OG_OPPLAERING,
    punktNavn: prosessStegCodes.MEDISINSK_VILKAR,
    tabNavn: tabCodes.INSTITUSJON,
  },
  {
    kode: 'PUNKT_FOR_LANGVARIG_SYK',
    faktaNavn: faktaPanelCodes.SYKDOM_OG_OPPLAERING,
    punktNavn: prosessStegCodes.MEDISINSK_VILKAR,
    tabNavn: tabCodes.SYKDOM,
  },
  {
    kode: 'PUNKT_FOR_NØDVENDIG_OPPLÆRING',
    faktaNavn: faktaPanelCodes.SYKDOM_OG_OPPLAERING,
    punktNavn: prosessStegCodes.MEDISINSK_VILKAR,
    tabNavn: tabCodes.OPPLÆRING,
  },
  {
    kode: 'PUNKT_FOR_REISEDAGER',
    faktaNavn: faktaPanelCodes.SYKDOM_OG_OPPLAERING,
    punktNavn: prosessStegCodes.MEDISINSK_VILKAR,
    tabNavn: tabCodes.REISETID,
  },
  {
    kode: 'FAKTA_OM_NY_INNTEKT',
    faktaNavn: faktaPanelCodes.NY_INNTEKT,
    punktNavn: '',
  },
];

let skjermlenkeCodeMap: Map<SkjermlenkeTypeWithExtraCodes, SkjermlenkeCode[]>;

export const lookupSkjermlenkeCode = (skjermlenkeType: SkjermlenkeTypeWithExtraCodes) => {
  if (skjermlenkeCodeMap == null) {
    skjermlenkeCodeMap = Map.groupBy(skjermlenkeCodes, ({ kode }: SkjermlenkeCode) => kode);
  }
  const code = skjermlenkeCodeMap.get(skjermlenkeType);
  if (code != null) {
    if (code[0] != null) {
      if (code.length > 1) {
        console.warn(`Mer enn 1 skjermlenkeCode innslag for skjermlenkeType ${skjermlenkeType}. Returnerer første`);
      }
      return code[0];
    }
  }
  return undefined;
};
