import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { Aksjonspunkt } from '@k9-sak-web/types';

export type EtablertTilsynVurderingstype = 'NATTEVÅK' | 'BEREDSKAP';

const aksjonspunktkoder = {
  NATTEVÅK: {
    ordinær: AksjonspunktDefinisjon.VURDER_NATTEVÅK,
    overstyring: AksjonspunktDefinisjon.OVERSTYRING_AV_NATTEVÅK,
  },
  BEREDSKAP: {
    ordinær: AksjonspunktDefinisjon.VURDER_BEREDSKAP,
    overstyring: AksjonspunktDefinisjon.OVERSTYRING_AV_BEREDSKAP,
  },
} as const;

export interface EtablertTilsynAksjonspunktTilstand {
  /** Koden som skal sendes inn. Undefined når saksbehandler ikke kan løse noe. */
  kode: AksjonspunktDefinisjon | undefined;
  erOverstyring: boolean;
  harUløstAksjonspunkt: boolean;
  harLøstAksjonspunkt: boolean;
  kanRedigere: boolean;
}

/**
 * Velger aksjonspunkt for nattevåk eller beredskap.
 * Finnes ordinært aksjonspunkt (9200/9201), åpent eller utført, brukes det.
 * Ellers kan saksbehandler redigere tidligere vurderinger med overstyringsaksjonspunkt (6018/6019),
 * når det er slått på.
 */
export const utledEtablertTilsynAksjonspunkt = (
  aksjonspunkter: Aksjonspunkt[],
  type: EtablertTilsynVurderingstype,
  kanOverstyre: boolean,
): EtablertTilsynAksjonspunktTilstand => {
  const koder = aksjonspunktkoder[type];
  const ordinærtAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === koder.ordinær);
  const harUløstAksjonspunkt = ordinærtAksjonspunkt?.status.kode === aksjonspunktStatus.OPPRETTET;
  const harLøstAksjonspunkt = ordinærtAksjonspunkt?.status.kode === aksjonspunktStatus.UTFØRT;

  if (harUløstAksjonspunkt || harLøstAksjonspunkt) {
    return { kode: koder.ordinær, erOverstyring: false, harUløstAksjonspunkt, harLøstAksjonspunkt, kanRedigere: true };
  }

  return {
    kode: kanOverstyre ? koder.overstyring : undefined,
    erOverstyring: kanOverstyre,
    harUløstAksjonspunkt: false,
    harLøstAksjonspunkt: false,
    kanRedigere: kanOverstyre,
  };
};

interface Periode {
  fom: string;
  tom: string;
}

interface LagreVurderingData {
  periode?: Periode;
  vurderinger?: unknown[];
}

/**
 * Lager data til submitCallback. Overstyringsaksjonspunktet krever `periode` på toppnivå.
 * Ordinært aksjonspunkt sendes som før, uten `periode`.
 */
export const lagEtablertTilsynAksjonspunktData = (
  tilstand: EtablertTilsynAksjonspunktTilstand,
  begrunnelse: string,
  data: LagreVurderingData,
) => {
  const { periode, ...resten } = data;
  if (tilstand.erOverstyring) {
    return { kode: tilstand.kode, begrunnelse, periode, vurderinger: data.vurderinger };
  }
  return { kode: tilstand.kode, begrunnelse, ...resten };
};
