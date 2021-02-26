import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

interface PureOwnProps {
  readOnly: boolean;
  isSubmitting: boolean;
}

/**
 * BekreftOgForsettKnapp:
 * Ansvarlig for å rendre bekreft og fortsett knappen, samt disable den hvis nødvendig
 */
export const BekreftOgForsettKnapp: FunctionComponent<PureOwnProps> = ({ readOnly, isSubmitting }) => (
  <>
    <VerticalSpacer twentyPx />
    <Hovedknapp mini spinner={isSubmitting} disabled={readOnly || isSubmitting}>
      <FormattedMessage id="FullPersonInfo.Confirm" />
    </Hovedknapp>
  </>
);

export default BekreftOgForsettKnapp;
