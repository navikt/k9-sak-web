import { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import AktivitetspengerSatsOgUtbetalingIndex from '@k9-sak-web/gui/prosess/aktivitetspenger-sats-og-utbetaling/AktivitetspengerSatsOgUtbetalingIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useContext } from 'react';
import { UngSakApi } from '../../data/UngSakApi';

const PANEL_ID = prosessStegCodes.SATS_OG_UTBETALING;

interface Props {
  api: UngSakApi;
  behandling: BehandlingDto;
}

export const SatsOgUtbetalingProsessStegInitPanel = ({ api, behandling }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  return <AktivitetspengerSatsOgUtbetalingIndex api={api} behandling={behandling} />;
};
