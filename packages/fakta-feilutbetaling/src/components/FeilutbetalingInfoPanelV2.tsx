import React from 'react';
import { useKodeverkV2 } from '@k9-sak-web/gui/kodeverk/hooks/useKodeverk.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { Label } from '@navikt/ds-react';

interface ownProps {
  harApneAksjonspunkter: boolean;
}

export const FeilutbetalingInfoPanelV2: React.FC<ownProps> = ({ harApneAksjonspunkter }) => {
  const { kodeverkNavnFraKode } = useKodeverkV2();
  const test = harApneAksjonspunkter ? 'Ja test' : 'Nei test';
  return (
    <div>
      <div>
        <Label>Behandlet Aksjonspunkt:</Label>
      </div>
    </div>
  );
};

export default FeilutbetalingInfoPanelV2;
