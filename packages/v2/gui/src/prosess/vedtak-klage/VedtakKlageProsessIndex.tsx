import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { assertDefined } from '../../utils/validation/assertDefined';
import { VedtakKlageApiContext } from './api/VedtakKlageApiContext';
import { VedtakKlage } from './components/VedtakKlage';

interface OwnProps {
  behandling: K9KlageBehandlingDto | UngSakBehandlingDto;
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: () => Promise<void>;
  isReadOnly: boolean;
}

export const VedtakKlageProsessIndex = ({ behandling, aksjonspunkter, submitCallback, isReadOnly }: OwnProps) => {
  const api = assertDefined(useContext(VedtakKlageApiContext));
  const { data: klageVurdering } = useSuspenseQuery({
    queryKey: ['klageVurdering', behandling, api.backend],
    queryFn: () => api.getKlageVurdering(behandling.uuid),
  });
  const { mutateAsync: previewCallback } = useMutation({
    mutationFn: async () => {
      if (behandling.id) {
        const response = await api.forhåndsvisKlageVedtaksbrev(behandling.id);
        const fileUrl = window.URL.createObjectURL(response);
        window.open(fileUrl, '_blank');
      }
    },
  });
  return (
    <VedtakKlage
      behandlingPåVent={!!behandling.behandlingPåVent}
      klageVurdering={klageVurdering}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewVedtakCallback={previewCallback}
      readOnly={isReadOnly}
    />
  );
};
