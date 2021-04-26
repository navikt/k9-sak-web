import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, Personopplysninger } from '@k9-sak-web/types';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import avsenderApplikasjon from '@fpsak-frontend/kodeverk/src/avsenderApplikasjon';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import ForhåndsvisRequest from '@k9-sak-web/types/src/formidlingTsType';
import { dokumentdatatype } from '@k9-sak-web/konstanter';

interface TilgjengeligeVedtaksbrev {
  vedtaksbrev: Array<string>;
  begrunnelse: string;
  alternativeMottakere: Array<{
    id: string;
    idType: string;
  }>;
  vedtaksbrevmaler: Map<string, string>;
}

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
  return Object.keys(tilgjengeligeVedtaksbrev.vedtaksbrevmaler);
}

export function finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).length > 0;
}

export function kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.AUTOMATISK);
}

export function kanHaFritekstbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  return vedtaksbrevmaler(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.FRITEKST);
}

export function harBareFritekstbrev(tilgjengeligeVedtaksbrev: TilgjengeligeVedtaksbrev): boolean {
  const vedtaksbrev = vedtaksbrevmaler(tilgjengeligeVedtaksbrev);
  return vedtaksbrev.length > 0 && vedtaksbrev.every(vb => vb === vedtaksbrevtype.FRITEKST);
}

export function harOverstyrtMedFritekstbrev(dokumentdata, vedtakVarsel): boolean {
  return (
    (dokumentdata?.[dokumentdatatype.VEDTAKSBREV_TYPE] ?? vedtakVarsel?.vedtaksbrev.kode) === vedtaksbrevtype.FRITEKST
  );
}

export function harOverstyrtMedIngenBrev(dokumentdata, vedtakVarsel): boolean {
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
  avsenderApplikasjon: bestemAvsenderApp(behandling.type.kode),
  ...data,
});

export default lagForhåndsvisRequest;
