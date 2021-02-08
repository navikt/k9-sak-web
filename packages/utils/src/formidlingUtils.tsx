import { Behandling, Fagsak, FagsakPerson, Personopplysninger, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import avsenderApplikasjon from '@fpsak-frontend/kodeverk/src/avsenderApplikasjon';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import ForhåndsvisRequest from '@k9-sak-web/types/src/formidlingTsType';

interface TilgjengeligeVedtaksbrev {
  vedtaksbrev: Array<string>;
  begrunnelse: string;
  alternativeMottakere: Array<{
    id: string;
    idType: string;
  }>;
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
    return `${personopplysninger.navn} (${mottakerId})`;
  }

  return mottakerId;
}

function lesTilgjengeligeVedtaksbrev(
  tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev,
): Array<string> {
  if (Array.isArray(tilgjengeligeVedtaksbrev)) {
    return tilgjengeligeVedtaksbrev;
  }

  if (typeof tilgjengeligeVedtaksbrev === 'object' && Array.isArray(tilgjengeligeVedtaksbrev.vedtaksbrev)) {
    return tilgjengeligeVedtaksbrev.vedtaksbrev;
  }

  return [];
}

export function finnesTilgjengeligeVedtaksbrev(
  tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev,
): boolean {
  return lesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev).length > 0;
}

export function kanHaAutomatiskVedtaksbrev(
  tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev,
): boolean {
  return lesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.AUTOMATISK);
}

export function kanHaFritekstbrev(tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev): boolean {
  return lesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev).some(vb => vb === vedtaksbrevtype.FRITEKST);
}

export function harBareFritekstbrev(tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev): boolean {
  return lesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev).every(vb => vb === vedtaksbrevtype.FRITEKST);
}

export function kanOverstyreMottakere(tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev): boolean {
  return (
    typeof tilgjengeligeVedtaksbrev === 'object' &&
    !Array.isArray(tilgjengeligeVedtaksbrev) &&
    Array.isArray(tilgjengeligeVedtaksbrev.alternativeMottakere) &&
    tilgjengeligeVedtaksbrev.alternativeMottakere.length > 0
  );
}

export const lagForhåndsvisRequest = (
  behandling: Behandling,
  fagsak: Fagsak,
  fagsakPerson: FagsakPerson,
  data: any,
): ForhåndsvisRequest => {
  return {
    eksternReferanse: behandling.uuid,
    ytelseType: fagsak.sakstype,
    saksnummer: fagsak.saksnummer,
    aktørId: fagsakPerson.aktørId,
    avsenderApplikasjon: bestemAvsenderApp(behandling.type.kode),
    ...data,
  };
};

export default lagForhåndsvisRequest;
