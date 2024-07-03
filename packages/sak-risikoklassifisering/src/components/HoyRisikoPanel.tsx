import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt, Risikoklassifisering } from '@k9-sak-web/types';
import { Box } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import AvklarFaresignalerForm, { VuderFaresignalerAp } from './AvklarFaresignalerForm';
import Faresignaler from './Faresignaler';

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  risikoklassifisering: Risikoklassifisering;
  aksjonspunkt?: Aksjonspunkt;
  readOnly: boolean;
  submitCallback: (verdier: VuderFaresignalerAp) => Promise<any>;
}

/**
 * AvklarFaresignaler
 *
 * Presentasjonskomponent. Statisk visning av panel som tilsier ingen faresignaler funnet i behandlingen.
 */
const HoyRisikoPanel = ({
  behandlingId,
  behandlingVersjon,
  risikoklassifisering,
  aksjonspunkt,
  readOnly,
  submitCallback,
}: OwnProps) => (
  <Box background="surface-default" padding="4">
    {aksjonspunkt && aksjonspunkt.status === aksjonspunktStatus.OPPRETTET && (
      <>
        <AksjonspunktHelpText isAksjonspunktOpen>
          <FormattedMessage id="Risikopanel.Panel.Tittel" />
        </AksjonspunktHelpText>
        <VerticalSpacer sixteenPx />
      </>
    )}
    <Faresignaler risikoklassifisering={risikoklassifisering} />
    {!!aksjonspunkt && (
      <AvklarFaresignalerForm
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        aksjonspunkt={aksjonspunkt}
        readOnly={readOnly}
        submitCallback={submitCallback}
        risikoklassifisering={risikoklassifisering}
      />
    )}
  </Box>
);

export default HoyRisikoPanel;
