import { Aksjonspunkt, Risikoklassifisering } from '@k9-sak-web/types';
import { Alert, ReadMore } from '@navikt/ds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { VuderFaresignalerAp } from './AvklarFaresignalerForm';
import HoyRisikoPanel from './HoyRisikoPanel';

interface OwnProps {
  risikoklassifisering: Risikoklassifisering;
  aksjonspunkt?: Aksjonspunkt;
  readOnly: boolean;
  submitCallback: (verdier: VuderFaresignalerAp) => Promise<any>;
  isRiskPanelOpen: boolean;
  toggleRiskPanel: () => void;
  behandlingId: number;
  behandlingVersjon: number;
}

/**
 * HoyRisikoTittel
 *
 * Presentasjonskomponent. Statisk visning av tittel i utvidbart panel dersom faresignaler er funnet.
 */
const HoyRisikoTittel = ({
  risikoklassifisering,
  aksjonspunkt,
  readOnly,
  submitCallback,
  isRiskPanelOpen,
  toggleRiskPanel,
  behandlingId,
  behandlingVersjon,
}: OwnProps) => {
  const intl = useIntl();
  return (
    <Alert variant="error">
      <ReadMore
        onClick={toggleRiskPanel}
        open={isRiskPanelOpen}
        header={intl.formatMessage({ id: 'Risikopanel.Tittel.Faresignaler' })}
      >
        <HoyRisikoPanel
          risikoklassifisering={risikoklassifisering}
          aksjonspunkt={aksjonspunkt}
          readOnly={readOnly}
          submitCallback={submitCallback}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      </ReadMore>
    </Alert>
  );
};
export default HoyRisikoTittel;
