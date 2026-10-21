import type { DokumentMalType } from '@k9-sak-web/backend/ungsak/kodeverk/dokument/DokumentMalType.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { mutationOptions } from '@tanstack/react-query';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';

export const forhåndsvisVedtaksbrevMutationOptions = (api: AktivitetspengerApi, behandling: BehandlingDto) =>
  mutationOptions({
    mutationFn: async (dokumentMalType: DokumentMalType) => {
      if (behandling.id === undefined) {
        throw new Error('Behandling ID mangler');
      }
      const response = await api.forhåndsvisVedtaksbrev(behandling.id, dokumentMalType);
      const fileURL = window.URL.createObjectURL(response);
      if (!window.open(fileURL, '_blank')) {
        window.URL.revokeObjectURL(fileURL);
        throw new Error('Nettleseren blokkerte forhåndsvisningen. Tillat popup-vinduer for denne siden og prøv igjen.');
      }
      return response;
    },
  });
