import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@k9-sak-web/shared-components';
import { Button } from '@navikt/ds-react';

interface PureOwnProps {
  readOnly: boolean;
  isSubmitting: boolean;
}

/**
 * BekreftOgForsettKnapp:
 * Ansvarlig for å rendre bekreft og fortsett knappen, samt disable den hvis nødvendig
 */
export const BekreftOgForsettKnapp = ({ readOnly, isSubmitting }: PureOwnProps) => (
  <>
    <VerticalSpacer twentyPx />
    <Button variant="primary" size="small" loading={isSubmitting} disabled={readOnly || isSubmitting}>
      <FormattedMessage id="FullPersonInfo.Confirm" />
    </Button>
  </>
);

export default BekreftOgForsettKnapp;
