import React from 'react';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextHTML, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Risikoklassifisering, Aksjonspunkt } from '@k9-sak-web/types';

import Faresignaler from './Faresignaler';
import AvklarFaresignalerForm, { VuderFaresignalerAp } from './AvklarFaresignalerForm';

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
  <Panel>
    {aksjonspunkt && aksjonspunkt.status === aksjonspunktStatus.OPPRETTET && (
      <>
        <AksjonspunktHelpTextHTML>
          <FormattedMessage id="Risikopanel.Panel.Tittel" />
        </AksjonspunktHelpTextHTML>
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
  </Panel>
);

export default HoyRisikoPanel;
