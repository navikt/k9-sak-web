import type { ung_sak_web_app_tjenester_klage_KlageRestTjeneste_AbacKlageVurderingResultatAksjonspunktMellomlagringDto as MellomlagringDataDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

export type SaveKlageParams = Exclude<MellomlagringDataDto, 'behandlingId'>;
