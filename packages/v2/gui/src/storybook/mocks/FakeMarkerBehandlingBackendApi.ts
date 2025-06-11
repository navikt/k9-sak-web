import { EndreMerknadRequestMerknadKode, SlettMerknadRequestMerknadKode } from '@k9-sak-web/backend/k9sak/generated';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';

export class FakeMarkerBehandlingBackendApi {
  getMerknader(behandlingUuid: string) {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve({
      hastesak: { aktiv: true, fritekst: 'En tekst om hvorfor dette er en hastesak' },
      utenlandstilsnitt: { aktiv: false, fritekst: null },
    });
  }

  markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: EndreMerknadRequestMerknadKode;
  }) {
    ignoreUnusedDeclared({ behandlingUuid, fritekst, merknadKode });
  }

  fjernMerknad({
    behandlingUuid,
    merknadKode,
  }: {
    behandlingUuid: string;
    merknadKode: SlettMerknadRequestMerknadKode;
  }) {
    ignoreUnusedDeclared({ behandlingUuid, merknadKode });
  }
}
