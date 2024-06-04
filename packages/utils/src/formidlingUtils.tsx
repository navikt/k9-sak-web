import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, Personopplysninger } from '@k9-sak-web/types';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import avsenderApplikasjon from '@fpsak-frontend/kodeverk/src/avsenderApplikasjon';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import ForhåndsvisRequest from '@k9-sak-web/types/src/formidlingTsType';
import { dokumentdatatype } from '@k9-sak-web/konstanter';
import { DokumentDataType } from '@k9-sak-web/types/src/dokumentdata';

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

export type Brevmottaker = Readonly<{
  id: string;
  type: string;
}>;

export function bestemAvsenderApp(type: string): string {
  return type === BehandlingType.KLAGE ? avsenderApplikasjon.K9KLAGE : avsenderApplikasjon.K9SAK;
}

export function lagVisningsnavnForMottaker(
  mottakerId: string,
  personopplysninger?: Personopplysninger,
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId,
): string {
  if (
    arbeidsgiverOpplysningerPerId &&
    arbeidsgiverOpplysningerPerId[mottakerId] &&
    arbeidsgiverOpplysningerPerId[mottakerId].navn
  ) {
    return `${arbeidsgiverOpplysningerPerId[mottakerId].navn} (${mottakerId})`;
  }

  if (personopplysninger && personopplysninger.aktoerId === mottakerId && personopplysninger.navn) {
    return `${personopplysninger.navn} (${personopplysninger.fnr || personopplysninger.nummer || mottakerId})`;
  }

  return mottakerId;
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
    (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev) === vedtaksbrevtype.FRITEKST ||
    !!dokumentdata?.[dokumentdatatype.FRITEKSTBREV]
  );
}

export function harSattDokumentdataType(dokumentdata: DokumentDataType, vedtakVarsel, vedtaksbreType: string): boolean {
  return (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev) === vedtaksbreType || false;
}

export function harMellomLagretMedIngenBrev(dokumentdata, vedtakVarsel): boolean {
  return (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev) === vedtaksbrevtype.INGEN;
}

export function kanOverstyreMottakere(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return (
    Array.isArray(tilgjengeligeVedtaksbrev?.alternativeMottakere) &&
    tilgjengeligeVedtaksbrev?.alternativeMottakere.length > 0
  );
}

export const filterInformasjonsbehov = (formikValues, aktiverteInformasjonsbehov) => {
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
  behandling: Behandling,
  fagsak: Fagsak,
  fagsakPerson: FagsakPerson,
  data: any,
): ForhåndsvisRequest => ({
  eksternReferanse: behandling.uuid,
  ytelseType: fagsak.sakstype,
  saksnummer: fagsak.saksnummer,
  aktørId: fagsakPerson.aktørId,
  avsenderApplikasjon: bestemAvsenderApp(behandling.type),
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
    fagsakPerson: FagsakPerson,
    behandling: Behandling,
  ) =>
  (parametre: any, aapneINyttVindu = true) => {
    const request = lagForhåndsvisRequest(behandling, fagsak, fagsakPerson, parametre);
    return forhandsvisMelding(request).then(response => (aapneINyttVindu ? forhandsvis(response) : response));
  };

// export const lagHentFritekstbrevHtmlRequest = (): HentFritekstbrevHtmlRequest => ()

export default lagForhåndsvisRequest;
