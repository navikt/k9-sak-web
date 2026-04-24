import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

/**
 * @deprecated Sjå info på LegacyBekreftAksjonspunktCallback
 */
export type LegacyBekreftAksjonspunktModell = Readonly<
  {
    kode: AksjonspunktDefinisjon;
    begrunnelse?: string;
  } & Record<string, unknown>
>;

/**
 * Denne type er her kun for å få inn litt typing av legacy submitCallback som blir sendt til v2 komponenter gjennom gammelt
 * opplegg for prosess steg panel definisjoner.
 * <p>
 * Vi ønsker å skrive oss vekk frå denne måten å bekrefte aksjonspunkt på. Ønsker å heller gjere api kall direkte i
 * komponent som i legacy kode kaller submitCallback, og heller ha enklere callbacks for å signalisere at aksjonspunkt
 * har blitt bekrefta oppover i komponent-treet ved behov.
 * <p>
 * Sjå AktivitetspengerBeregning.tsx for eksempel på ny måte å bekrefte aksjonspunkt på.
 *
 * @deprecated Ønsker å skrive oss vekk frå å submitCallback opplegget i v2. (Sjå full kommentar på typen).
 */
export type LegacyBekreftAksjonspunktCallback = (
  aksjonspunktModels: LegacyBekreftAksjonspunktModell[],
) => Promise<void>;
