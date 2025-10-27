import {
  formidling_forhåndsvisKlageVedtaksbrev,
  noNavK9Klage_getKlageVurdering,
  noNavK9Klage_hentValgbareKlagehjemler,
  noNavK9Klage_mellomlagreKlage,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import {
  ung_kodeverk_klage_KlageMedholdÅrsak,
  ung_kodeverk_klage_KlageVurderingOmgjør,
  ung_kodeverk_klage_KlageVurderingType,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export default class KlageVurderingBackendClient {
  async forhåndsvisKlageVedtaksbrev(behandlingId: number) {
    return (await formidling_forhåndsvisKlageVedtaksbrev({ body: { behandlingId } })).data;
  }

  async getKlageVurdering(behandlingUuid: string) {
    return (await noNavK9Klage_getKlageVurdering({ query: { behandlingUuid } })).data;
  }

  async mellomlagreKlage({
    begrunnelse,
    behandlingId,
    fritekstTilBrev,
    klageHjemmel,
    klageMedholdArsak,
    klageVurdering,
    klageVurderingOmgjoer,
    kode,
  }: {
    begrunnelse: string;
    behandlingId: number;
    fritekstTilBrev: string;
    klageHjemmel?: string;
    klageMedholdArsak: ung_kodeverk_klage_KlageMedholdÅrsak;
    klageVurdering: ung_kodeverk_klage_KlageVurderingType;
    klageVurderingOmgjoer: ung_kodeverk_klage_KlageVurderingOmgjør;
    kode: string;
  }) {
    return await noNavK9Klage_mellomlagreKlage({
      body: {
        begrunnelse,
        behandlingId,
        fritekstTilBrev,
        klageHjemmel,
        klageMedholdArsak,
        klageVurdering,
        klageVurderingOmgjoer,
        kode,
      },
    });
  }

  async hentValgbareKlagehjemler() {
    return (await noNavK9Klage_hentValgbareKlagehjemler()).data;
  }
}
