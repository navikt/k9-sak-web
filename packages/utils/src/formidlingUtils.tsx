import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import { InformasjonsbehovVedtaksbrev } from '@fpsak-frontend/prosess-vedtak/src/components/brev/InformasjonsbehovAutomatiskVedtaksbrev';
import { isBehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import type { Mottaker } from '@k9-sak-web/backend/k9formidling/models/Mottaker.js';
import type { BehandlingInfo } from '@k9-sak-web/gui/sak/BehandlingInfo.js';
import type { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import { lagVisningsnavnForMottaker as v2LagvisningsnavnForMottaker } from '@k9-sak-web/gui/sak/meldinger/MottakerSelect.js';
import {
  ArbeidsgiverOpplysningerPerId,
  Personopplysninger,
  bestemAvsenderApp as v2BestemAvsenderApp,
} from '@k9-sak-web/gui/utils/formidling.js';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';
import ForhåndsvisRequest from '@k9-sak-web/types/src/formidlingTsType';

export interface VedtaksbrevMal {
  dokumentMalType: string;
  redigerbarMalType: string;
  vedtaksbrev: string;
}

export interface TilgjengeligeVedtaksbrevMedMaler {
  maler?: VedtaksbrevMal[];
}

export interface TilgjengeligeVedtaksbrev {
  begrunnelse: string;
  alternativeMottakere: Array<Brevmottaker>;
  vedtaksbrevmaler: Record<string, string>;
}

export type Brevmottaker = Readonly<Mottaker>;

export function bestemAvsenderApp(type: string): string {
  if (isBehandlingType(type)) {
    return v2BestemAvsenderApp(type);
  }
  throw new Error(`Kan ikke bestemme avsender app. Ukjent behandling type: ${type}`);
}

export function lagVisningsnavnForMottaker(
  mottaker: Mottaker,
  personopplysninger?: Personopplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string {
  return v2LagvisningsnavnForMottaker(mottaker, personopplysninger, arbeidsgiverOpplysningerPerId);
}

function vedtaksbrevmaler(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev) {
  return tilgjengeligeVedtaksbrev?.vedtaksbrevmaler ? Object.keys(tilgjengeligeVedtaksbrev.vedtaksbrevmaler) : [];
}

export function finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).length > 0;
}

export function kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.AUTOMATISK);
}

export function kanHaFritekstbrevV1(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.FRITEKST);
}

export function kanHaManueltFritekstbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.MANUELL);
}

export function kanHindreUtsending(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.INGEN);
}

export function kanKunVelge(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev, brevtype): boolean {
  const vedtaksbrev = vedtaksbrevmaler(tilgjengeligeVedtaksbrev);
  return vedtaksbrev.length > 0 && vedtaksbrev.every(vb => vb === brevtype);
}

export function harMellomlagretFritekstbrev(dokumentdata, vedtakVarsel): boolean {
  return (
    (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev.kode) ===
      vedtaksbrevtype.FRITEKST || !!dokumentdata?.[dokumentdatatype.FRITEKSTBREV]
  );
}

export function harSattDokumentdataType(dokumentdata: DokumentDataType, vedtakVarsel, vedtaksbreType: string): boolean {
  return (
    (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev.kode) === vedtaksbreType || false
  );
}

export function harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel): boolean {
  return (
    (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev.kode) === vedtaksbrevtype.INGEN
  );
}

export function kanOverstyreMottakere(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return (
    Array.isArray(tilgjengeligeVedtaksbrev?.alternativeMottakere) &&
    tilgjengeligeVedtaksbrev?.alternativeMottakere.length > 0
  );
}

export const filterInformasjonsbehov = (
  formikValues,
  aktiverteInformasjonsbehov: InformasjonsbehovVedtaksbrev['informasjonsbehov'],
) => {
  const aktiveVerdier = [];
  const keys = Object.keys(formikValues);

  keys.forEach(key => {
    if (aktiverteInformasjonsbehov.some(informasjonsbehov => informasjonsbehov.kode === key))
      aktiveVerdier.push({ [key]: formikValues[key] });
  });
  return aktiveVerdier;
};

export const harPotensieltFlereInformasjonsbehov = infobehovVedtaksbrev => {
  if (infobehovVedtaksbrev) {
    const { informasjonsbehov } = infobehovVedtaksbrev;
    return informasjonsbehov.length > 0;
  }
  return false;
};

export const harMellomlagretRedusertUtbetalingArsak = (key, dokumentdata, vedtakVarsel) => {
  const årsaker =
    dokumentdata?.[dokumentdatatype.REDUSERT_UTBETALING_AARSAK] || vedtakVarsel?.redusertUtbetalingÅrsaker || [];
  return årsaker.some(v => v === key);
};

export const lagForhåndsvisRequest = (
  behandling: BehandlingInfo,
  fagsak: Fagsak,
  fagsakPerson: Fagsak['person'],
  data: any,
): ForhåndsvisRequest => ({
  eksternReferanse: behandling.uuid,
  ytelseType: fagsak.sakstype,
  saksnummer: fagsak.saksnummer,
  aktørId: fagsakPerson.aktørId,
  avsenderApplikasjon: bestemAvsenderApp(behandling.type.kode),
  ...data,
});

export const forhandsvis = (data: any) => {
  if (URL.createObjectURL) {
    window.open(URL.createObjectURL(data));
  }
};

export const getForhandsvisCallback =
  (
    forhandsvisMelding: (data: any) => Promise<any>,
    fagsak: Fagsak,
    fagsakPerson: Fagsak['person'],
    behandling: Behandling,
  ) =>
  (parametre: any, aapneINyttVindu = true) => {
    const request = lagForhåndsvisRequest(behandling, fagsak, fagsakPerson, parametre);
    return forhandsvisMelding(request).then(response => (aapneINyttVindu ? forhandsvis(response) : response));
  };

// export const lagHentFritekstbrevHtmlRequest = (): HentFritekstbrevHtmlRequest => ()

export default lagForhåndsvisRequest;
