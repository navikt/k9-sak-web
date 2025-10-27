import {
  ung_kodeverk_behandling_FagsakYtelseType,
  ung_kodeverk_klage_KlageMedholdÅrsak,
  ung_kodeverk_klage_KlageVurderingOmgjør,
  ung_kodeverk_klage_KlageVurderingType,
  type ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  type ung_sak_kontrakt_behandling_BehandlingDto,
  type ung_sak_kontrakt_fagsak_FagsakDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import AksjonspunktCodes from '@k9-sak-web/lib/kodeverk/types/AksjonspunktCodes.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoadingPanel } from '../../shared/loading-panel/LoadingPanel';
import KlageVurderingBackendClient from './KlageVurderingBackendClient';
import type { SaveKlageParams } from './src/components/felles/SaveKlageParams';
import { BehandleKlageFormKa } from './src/components/ka/BehandleKlageFormKa';
import { BehandleKlageFormNfp } from './src/components/nfp/BehandleKlageFormNfp';

// type ValidatedSaveKlageParams = z.infer<typeof SaveKlageSchema>;

interface KlagevurderingProsessIndexProps {
  fagsak: ung_sak_kontrakt_fagsak_FagsakDto;
  submitCallback: () => Promise<void>;
  isReadOnly: boolean;
  readOnlySubmitButton: boolean;
  aksjonspunkter: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
}

export const KlagevurderingProsessIndex = ({
  fagsak,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  aksjonspunkter,
  behandling,
}: KlagevurderingProsessIndexProps) => {
  const api = new KlageVurderingBackendClient();
  const { data: ungHjemler = [] } = useQuery({
    queryKey: ['ung-klage-hjemler'],
    queryFn: () => api.hentValgbareKlagehjemler(),
    enabled: fagsak.sakstype === ung_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE,
  });
  const { data: klageVurdering, isLoading } = useQuery({
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
  const { mutateAsync: saveKlage } = useMutation({
    mutationFn: async (params: SaveKlageParams) => {
      if (behandling.id) {
        await api.mellomlagreKlage({
          begrunnelse: params.begrunnelse,
          behandlingId: behandling.id,
          fritekstTilBrev: params.fritekstTilBrev,
          klageHjemmel: params.klageHjemmel ?? undefined,
          klageMedholdArsak: (params.klageMedholdArsak as ung_kodeverk_klage_KlageMedholdÅrsak) ?? undefined,
          klageVurdering: params.klageVurdering as ung_kodeverk_klage_KlageVurderingType,
          klageVurderingOmgjoer: (params.klageVurderingOmgjoer as ung_kodeverk_klage_KlageVurderingOmgjør) ?? undefined,
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
            previewCallback={previewCallback}
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
            previewCallback={previewCallback}
            readOnlySubmitButton={readOnlySubmitButton}
            ungHjemler={ungHjemler}
          />
        )}
    </>
  );
};
