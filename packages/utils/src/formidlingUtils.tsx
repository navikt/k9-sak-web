import { Behandling, FagsakInfo } from '@k9-sak-web/types';
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

export function bestemAvsenderApp(type: string) {
  return type === BehandlingType.KLAGE ? avsenderApplikasjon.K9KLAGE : avsenderApplikasjon.K9SAK;
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
  return lesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev).some(vb => vb === 'AUTOMATISK');
}

export function kanHaFritekstbrev(tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev): boolean {
  return lesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev).some(vb => vb === 'FRITEKST');
}

export function kanOverstyreMottakere(tilgjengeligeVedtaksbrev: Array<string> | TilgjengeligeVedtaksbrev): boolean {
  return (
    typeof tilgjengeligeVedtaksbrev === 'object' &&
    !Array.isArray(tilgjengeligeVedtaksbrev) &&
    Array.isArray(tilgjengeligeVedtaksbrev.alternativeMottakere)
  );
}

const lagForhåndsvisRequest = (behandling: Behandling, fagsak: FagsakInfo, data: any): ForhåndsvisRequest => {
  return {
    eksternReferanse: behandling.uuid,
    ytelseType: fagsak.fagsakYtelseType,
    saksnummer: fagsak.saksnummer,
    aktørId: fagsak.fagsakPerson.aktørId,
    avsenderApplikasjon: bestemAvsenderApp(behandling.type.kode),
    ...data,
  };
};

export default lagForhåndsvisRequest;
