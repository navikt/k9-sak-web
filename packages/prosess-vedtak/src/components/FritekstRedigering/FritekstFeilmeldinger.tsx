import React from 'react';
import { injectIntl } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { useRestApiError } from '@k9-sak-web/rest-api-hooks';
import { Alert } from '@navikt/ds-react';

import { harDokumentdataApiFeilmelding, harForhandsvisFeilmeldinger } from './RedigeringUtils';

import styles from './RedigerFritekstbrev.module.css';

const FritekstFeilmeldinger = () => {
  const errors = useRestApiError() || [];

  if (harDokumentdataApiFeilmelding({ errors }) || harForhandsvisFeilmeldinger({ errors })) {
    return (
      <>
        <VerticalSpacer sixteenPx />
        <Alert variant="error" className={styles.alertMeldinger}>
          {errors.map(error => {
            return <p key={error.errorId}>{error.message}</p>;
          })}
        </Alert>
        <VerticalSpacer sixteenPx />
      </>
    );
  }

  return null;
};

export default injectIntl(FritekstFeilmeldinger);
