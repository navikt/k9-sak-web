import { Behandling, FagsakInfo } from '@k9-sak-web/types';
import avsenderApplikasjon from '@fpsak-frontend/kodeverk/src/avsenderApplikasjon';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import ForhåndsvisRequest from '@k9-sak-web/types/src/formidlingTsType';

export function bestemAvsenderApp(type: string) {
  return type === BehandlingType.KLAGE ? avsenderApplikasjon.K9KLAGE : avsenderApplikasjon.K9SAK;
}

export const finnesTilgjengeligeVedtaksbrev = (tilgjengeligeVedtaksbrev: Array<string>) =>
  tilgjengeligeVedtaksbrev && Array.isArray(tilgjengeligeVedtaksbrev) && tilgjengeligeVedtaksbrev.length > 0;

export const kanHaAutomatiskVedtaksbrev = (tilgjengeligeVedtaksbrev: Array<string>) =>
  finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev) && tilgjengeligeVedtaksbrev.some(vb => vb === 'AUTOMATISK');

export const kanHaFritekstbrev = (tilgjengeligeVedtaksbrev: Array<string>) =>
  finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev) && tilgjengeligeVedtaksbrev.some(vb => vb === 'FRITEKST');

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
