import type { MerknadType } from '@k9-sak-web/backend/k9sak/kodeverk/produksjonsstyring/MerknadType.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';

export class FakeMarkerBehandlingBackendApi {
  getMerknader(behandlingUuid: string) {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve({
      hastesak: { aktiv: true, fritekst: 'En tekst om hvorfor dette er en hastesak' },
      utenlandssak: { aktiv: false, fritekst: undefined },
      direkteutbetaling: { aktiv: false, fritekst: undefined },
    });
  }

  markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: MerknadType;
  }) {
    ignoreUnusedDeclared({ behandlingUuid, fritekst, merknadKode });
    return Promise.resolve();
  }

  fjernMerknad({ behandlingUuid, merknadKode }: { behandlingUuid: string; merknadKode: MerknadType }) {
    ignoreUnusedDeclared({ behandlingUuid, merknadKode });
    return Promise.resolve();
  }
}
