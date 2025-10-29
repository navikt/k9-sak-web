import React from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { useRestApiError } from '@k9-sak-web/rest-api-hooks';
import { Alert } from '@navikt/ds-react';

import {
  harDokumentdataApiFeilmelding,
  harForhandsvisFeilmeldinger,
  utledForhandsvisFeilmeldinger,
} from './RedigeringUtils';

import styles from './RedigerFritekstbrev.module.css';

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
              Det har oppstått en feil under kommunikasjon med serveren, endringene vil ikke bli lagret. Kopier innholdet i brevet og prøv å last siden på nytt.
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
