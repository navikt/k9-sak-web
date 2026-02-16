import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import { k9_kodeverk_behandling_BehandlingStatus as BehandlingStatus } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { TotrinnskontrollApi, TotrinnskontrollData } from './api/TotrinnskontrollApi.js';
import {
  TotrinnskontrollBeslutterForm,
  type TotrinnskontrollBeslutterFormProps,
} from './components/TotrinnskontrollBeslutterForm.js';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel.js';
import type { TotrinnskontrollBehandling } from './types/TotrinnskontrollBehandling.js';

interface TotrinnskontrollSakIndexProps {
  behandling: TotrinnskontrollBehandling;
  totrinnskontrollData: TotrinnskontrollData;
  behandlingKlageVurdering?: KlagebehandlingDto;
  readOnly: boolean;
  api: Pick<TotrinnskontrollApi, 'bekreft'>;
  onBekreftet: TotrinnskontrollBeslutterFormProps['onBekreftet'];
}

export const TotrinnskontrollSakIndex = ({
  behandling,
  totrinnskontrollData,
  readOnly,
  behandlingKlageVurdering,
  api,
  onBekreftet,
}: TotrinnskontrollSakIndexProps) => {
  const erStatusFatterVedtak = behandling.status === BehandlingStatus.FATTER_VEDTAK;

  return (
    <>
      {erStatusFatterVedtak && (
        <TotrinnskontrollBeslutterForm
          behandling={behandling}
          totrinnskontrollData={totrinnskontrollData}
          readOnly={readOnly}
          behandlingKlageVurdering={behandlingKlageVurdering}
          api={api}
          onBekreftet={onBekreftet}
        />
      )}
      {!erStatusFatterVedtak && (
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollData={totrinnskontrollData}
          behandlingKlageVurdering={behandlingKlageVurdering}
          behandlingStatus={behandling.status}
        />
      )}
    </>
  );
};
