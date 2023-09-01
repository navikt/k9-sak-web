import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { useRestApiError } from '@k9-sak-web/rest-api-hooks';
import { Alert } from '@navikt/ds-react';

import {
  harDokumentdataApiFeilmelding,
  harForhandsvisFeilmeldinger,
  utledForhandsvisFeilmeldinger,
} from './RedigeringUtils';

import styles from './RedigerFritekstbrev.css';

const FritekstFeilmeldinger = () => {
  const errorMessages = useRestApiError() || [];

  if (
    harDokumentdataApiFeilmelding({ feilmeldinger: errorMessages }) ||
    harForhandsvisFeilmeldinger({ feilmeldinger: errorMessages })
  ) {
    return (
      <>
        <VerticalSpacer sixteenPx />
        <Alert variant="error" className={styles.alertMeldinger}>
          {utledForhandsvisFeilmeldinger({ feilmeldinger: errorMessages }).map(feilmelding => (
            <p>{feilmelding.feilmelding}</p>
          ))}
          {harDokumentdataApiFeilmelding({ feilmeldinger: errorMessages }) && (
            <p>
              <FormattedMessage id="RedigeringAvFritekstBrev.KommunikasjonsfeilLagre" />
            </p>
          )}
        </Alert>
        <VerticalSpacer sixteenPx />
      </>
    );
  }

  return null;
};

export default injectIntl(FritekstFeilmeldinger);
