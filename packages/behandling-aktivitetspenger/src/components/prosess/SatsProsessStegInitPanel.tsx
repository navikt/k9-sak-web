import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import { DagsatsOgUtbetaling, sortSatser } from '@k9-sak-web/gui/shared/dagsats-og-utbetaling/DagsatsOgUtbetaling.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Heading, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import type { UngSakApi } from '../../data/UngSakApi';
import { satsOgUtbetalingPerioderQueryOptions } from '../../data/ungSakQueryOptions';

const PANEL_ID = prosessStegCodes.SATS;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
}

export const SatsProsessStegInitPanel = ({ api, behandling }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erTilBehandlingEllerBehandlet = !!prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  const { data: satser } = useSuspenseQuery({
    ...satsOgUtbetalingPerioderQueryOptions(api, behandling, erTilBehandlingEllerBehandlet),
    select: sortSatser,
  });

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (!satser) {
    return null;
  }

  return (
    <VStack>
      <Heading size="medium" level="2">
        Sats og beregning
      </Heading>
      <DagsatsOgUtbetaling satser={satser} />
    </VStack>
  );
};
