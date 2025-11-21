import type { AksjonspunktDto } from '@k9-sak-web/backend/combined/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { FagsakDto } from '@k9-sak-web/backend/combined/kontrakt/fagsak/FagsakDto.js';
import type { BehandlingDto as K9KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/kontrakt/behandling/BehandlingDto.js';
import type { BehandlingDto as UngSakBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { LoadingPanel } from '../../shared/loading-panel/LoadingPanel';
import { isUngFagsak } from '../../utils/fagsakUtils.js';
import { assertDefined } from '../../utils/validation/assertDefined.js';
import { KlageVurderingApiContext } from './api/KlageVurderingApiContext.js';
import type { PreviewData } from './src/components/felles/PreviewData.js';
import type { SaveKlageParams } from './src/components/felles/SaveKlageParams';
import { BehandleKlageFormKa } from './src/components/ka/BehandleKlageFormKa';
import { BehandleKlageFormNfp } from './src/components/nfp/BehandleKlageFormNfp';

interface KlagevurderingProsessIndexProps {
  fagsak: FagsakDto;
  submitCallback: () => Promise<void>;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: AksjonspunktDto[];
  behandling: K9KlageBehandlingDto | UngSakBehandlingDto;
  previewCallbackK9Klage?: (brevdata?: PreviewData) => Promise<void>;
}

export const KlagevurderingProsessIndex = ({
  fagsak,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandling,
  previewCallbackK9Klage,
}: KlagevurderingProsessIndexProps) => {
  const api = assertDefined(useContext(KlageVurderingApiContext));
  const isUngdomsprogram = isUngFagsak(fagsak);
  const { data: ungHjemler = [] } = useQuery({
    queryKey: ['klage-hjemler', api.backend, api.hentValgbareKlagehjemlerForUng],
    queryFn: () => (api.hentValgbareKlagehjemlerForUng ? api.hentValgbareKlagehjemlerForUng() : []),
    enabled: isUngdomsprogram && api.hentValgbareKlagehjemlerForUng !== undefined,
  });
  const { data: klageVurdering, isLoading } = useQuery({
    queryKey: ['klageVurdering', behandling, api.backend],
    queryFn: () => api.getKlageVurdering(behandling.uuid),
  });
  const { mutateAsync: previewCallbackUngSak } = useMutation({
    mutationFn: async () => {
      if (behandling.id && api.forhåndsvisKlageVedtaksbrev) {
        const response = await api.forhåndsvisKlageVedtaksbrev(behandling.id);
        const fileUrl = window.URL.createObjectURL(response);
        window.open(fileUrl, '_blank');
      }
    },
  });

  const previewCallbackSelect = (brevdata?: PreviewData) => {
    if (isUngdomsprogram) {
      return previewCallbackUngSak();
    }
    if (previewCallbackK9Klage) {
      return previewCallbackK9Klage(brevdata);
    }
    return Promise.resolve();
  };

  const { mutateAsync: saveKlage } = useMutation({
    mutationFn: async (params: SaveKlageParams) => {
      if (behandling.id) {
        await api.mellomlagreKlage({
          begrunnelse: params.begrunnelse,
          behandlingId: behandling.id,
          fritekstTilBrev: params.fritekstTilBrev,
          klageHjemmel: params.klageHjemmel ?? undefined,
          klageMedholdArsak: params.klageMedholdArsak,
          klageVurdering: params.klageVurdering,
          klageVurderingOmgjoer: params.klageVurderingOmgjoer,
          kode: params.kode,
        });
      }
    },
  });
  if (isLoading) {
    return <LoadingPanel />;
  }
  if (!klageVurdering) {
    return null;
  }
  return (
    <>
      {Array.isArray(aksjonspunkter) &&
        aksjonspunkter.some(a => a.definisjon === AksjonspunktCodes.BEHANDLE_KLAGE_NK) && (
          <BehandleKlageFormKa
            klageVurdering={klageVurdering}
            saveKlage={saveKlage}
            submitCallback={submitCallback}
            isReadOnly={isReadOnly}
            previewCallback={previewCallbackSelect}
            readOnlySubmitButton={readOnlySubmitButton}
          />
        )}
      {Array.isArray(aksjonspunkter) &&
        aksjonspunkter.some(a => a.definisjon === AksjonspunktCodes.BEHANDLE_KLAGE_NFP) && (
          <BehandleKlageFormNfp
            fagsak={fagsak}
            klageVurdering={klageVurdering}
            saveKlage={saveKlage}
            submitCallback={submitCallback}
            isReadOnly={isReadOnly}
            previewCallback={previewCallbackSelect}
            readOnlySubmitButton={readOnlySubmitButton}
            ungHjemler={ungHjemler}
          />
        )}
    </>
  );
};
