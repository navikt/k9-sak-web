import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

/**
 * BekreftOgForsettKnapp:
 * Ansvarlig for å rendre bekreft og fortsett knappen, samt disable den hvis nødvendig
 */
export const BekreftOgForsettKnappV2 = ({ isSubmitting, readOnly }) => (
  <>
    <VerticalSpacer twentyPx />
    <Hovedknapp mini spinner={isSubmitting} disabled={readOnly || isSubmitting}>
      <FormattedMessage id="FullPersonInfo.Confirm" />
    </Hovedknapp>
  </>
);

BekreftOgForsettKnappV2.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default BekreftOgForsettKnappV2;
