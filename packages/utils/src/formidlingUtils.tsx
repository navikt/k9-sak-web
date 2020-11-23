import {Behandling, FagsakInfo} from '@k9-sak-web/types';
import avsenderApplikasjon from "@fpsak-frontend/kodeverk/src/avsenderApplikasjon";
import BehandlingType from "@fpsak-frontend/kodeverk/src/behandlingType";
import fagsakYtelseType from "@fpsak-frontend/kodeverk/src/fagsakYtelseType";
import ForhåndsvisRequest from "@k9-sak-web/types/src/formidlingTsType";

function mapFagsakYtelseType(type: any): string {
  return type.kode === fagsakYtelseType.OMSORGSPENGER ? "OMSORGSPENGER" : type.kode;
}

const lagForhåndsvisRequest = (behandling: Behandling, fagsak: FagsakInfo, data: any): ForhåndsvisRequest => {
  const {dokumentMal, dokumentdata} = data
  return {
    behandlingUuid: behandling.uuid,
    eksternReferanse: behandling.uuid,
    ytelseType: mapFagsakYtelseType(fagsak.fagsakYtelseType),
    saksnummer: fagsak.saksnummer,
    aktørId: fagsak.fagsakPerson.aktørId,
    avsenderApplikasjon: behandling.type === BehandlingType.KLAGE ? avsenderApplikasjon.K9KLAGE : avsenderApplikasjon.K9SAK,
    dokumentMal,
    dokumentdata
  }
}

export default lagForhåndsvisRequest
