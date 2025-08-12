import { kodeverk_produksjonsstyring_BehandlingMerknadType as BehandlingMerknadKode } from '@k9-sak-web/backend/k9sak/generated';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';

export class FakeMarkerBehandlingBackendApi {
  getMerknader(behandlingUuid: string) {
    ignoreUnusedDeclared(behandlingUuid);
    return Promise.resolve({
      hastesak: { aktiv: true, fritekst: 'En tekst om hvorfor dette er en hastesak' },
      utenlandstilsnitt: { aktiv: false, fritekst: undefined },
    });
  }

  markerBehandling({
    behandlingUuid,
    fritekst,
    merknadKode,
  }: {
    behandlingUuid: string;
    fritekst: string;
    merknadKode: BehandlingMerknadKode;
  }) {
    ignoreUnusedDeclared({ behandlingUuid, fritekst, merknadKode });
    return Promise.resolve();
  }

  fjernMerknad({ behandlingUuid, merknadKode }: { behandlingUuid: string; merknadKode: BehandlingMerknadKode }) {
    ignoreUnusedDeclared({ behandlingUuid, merknadKode });
    return Promise.resolve();
  }
}
