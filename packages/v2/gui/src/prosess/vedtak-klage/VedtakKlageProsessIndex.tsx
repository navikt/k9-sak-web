import type {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { assertDefined } from '../../utils/validation/assertDefined';
import { VedtakKlageApiContext } from './api/VedtakKlageApiContext';
import { VedtakKlageForm } from './components/VedtakKlageForm';

interface OwnProps {
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
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
    <VedtakKlageForm
      behandlingPåVent={!!behandling.behandlingPåVent}
      klageVurdering={klageVurdering}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewVedtakCallback={previewCallback}
      readOnly={isReadOnly}
    />
  );
};
