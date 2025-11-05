import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import {
  k9_kodeverk_behandling_FagsakYtelseType,
  type k9_sak_kontrakt_fagsak_FagsakDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { assertDefined } from '../../utils/validation/assertDefined';
import { VedtakKlageApiContext } from './api/VedtakKlageApiContext';
import { VedtakKlage } from './components/VedtakKlage';

interface OwnProps {
  behandling: K9KlageBehandlingDto | UngSakBehandlingDto;
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: () => Promise<void>;
  isReadOnly: boolean;
  fagsak: k9_sak_kontrakt_fagsak_FagsakDto;
}

export const VedtakKlageProsessIndex = ({
  behandling,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  fagsak,
}: OwnProps) => {
  const api = assertDefined(useContext(VedtakKlageApiContext));
  const { data: klageVurdering } = useSuspenseQuery({
    queryKey: ['klageVurdering', behandling, api.backend],
    queryFn: () => api.getKlageVurdering(behandling.uuid),
  });
  const isUngdomsprogramytelse = fagsak.sakstype === k9_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE;
  const { data: valgtPartMedKlagerett } = useQuery({
    queryKey: ['klageParterMedKlagerett', behandling, api.backend],
    queryFn: () => api.hentAlleParterMedKlagerett(behandling.uuid),
    enabled: !isUngdomsprogramytelse,
  });

  const { mutateAsync: previewCallback } = useMutation({
    mutationFn: async () => {
      if (behandling.id) {
        const response = await api.forhåndsvisKlageVedtaksbrev(
          behandling.id,
          !isUngdomsprogramytelse
            ? {
                eksternReferanse: behandling.uuid,
                ytelseType: fagsak.sakstype,
                saksnummer: fagsak.saksnummer,
                aktørId: fagsak.person?.aktørId ?? '',
                avsenderApplikasjon: 'K9KLAGE',
                dokumentMal: 'UTLED',
                dokumentdata: null,
                overstyrtMottaker: valgtPartMedKlagerett && valgtPartMedKlagerett.identifikasjon,
              }
            : undefined,
        );
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
