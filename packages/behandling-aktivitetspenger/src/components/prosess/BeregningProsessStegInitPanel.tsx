import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import AktivitetspengerBeregningIndex from '@k9-sak-web/gui/prosess/aktivitetspenger-beregning/AktivitetspengerBeregningIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ung_sak_kontrakt_behandling_BehandlingDto } from '@navikt/ung-sak-typescript-client/types';
import { useContext } from 'react';

const PANEL_ID = prosessStegCodes.BEREGNING;

interface Props {
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
}

export const BeregningProsessStegInitPanel = ({ behandling }: Props) => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

  if (!erValgt) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  return <AktivitetspengerBeregningIndex behandling={behandling} />;
};
