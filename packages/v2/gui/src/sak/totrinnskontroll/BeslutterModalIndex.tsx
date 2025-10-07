import type { TotrinnskontrollBehandling } from './types/TotrinnskontrollBehandling.js';
import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import { type FC, useCallback } from 'react';
import FatterVedtakApprovalModal from './components/modal/FatterVedtakApprovalModal.tsx';

export interface BeslutterModalIndex2Props {
  readonly behandling: TotrinnskontrollBehandling;
  readonly fagsakYtelseType: FagsakYtelseType;
  readonly erAlleAksjonspunktGodkjent: boolean;
  readonly erKlageWithKA: boolean;
  readonly urlEtterpå: string;
}

export const BeslutterModalIndex: FC<BeslutterModalIndex2Props> = ({
  behandling,
  fagsakYtelseType,
  erAlleAksjonspunktGodkjent,
  erKlageWithKA,
  urlEtterpå,
}) => {
  const gåTilUrlEtterpå = useCallback(() => {
    window.location.assign(urlEtterpå);
  }, [urlEtterpå]);

  return (
    <FatterVedtakApprovalModal
      behandling={behandling}
      closeEvent={gåTilUrlEtterpå}
      allAksjonspunktApproved={erAlleAksjonspunktGodkjent}
      fagsakYtelseType={fagsakYtelseType}
      erKlageWithKA={erKlageWithKA}
    />
  );
};
