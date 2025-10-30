import type {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { VedtakKlageForm } from './components/VedtakKlageForm';
import VedtakKlageBackendClient from './VedtakKlageBackendClient';

interface OwnProps {
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: () => Promise<void>;
  isReadOnly: boolean;
}

export const VedtakKlageProsessIndex = ({ behandling, aksjonspunkter, submitCallback, isReadOnly }: OwnProps) => {
  const api = new VedtakKlageBackendClient();
  const { data: klageVurdering } = useSuspenseQuery({
    queryKey: ['klageVurdering', behandling],
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
    <>
      {klageVurdering ? (
        <VedtakKlageForm
          behandlingsresultat={behandling.behandlingsresultat}
          behandlingPåVent={!!behandling.behandlingPåVent}
          klageVurdering={klageVurdering}
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          previewVedtakCallback={previewCallback}
          readOnly={isReadOnly}
        />
      ) : null}
    </>
  );
};
