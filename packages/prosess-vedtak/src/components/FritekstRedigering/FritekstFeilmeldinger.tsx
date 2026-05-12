import React from 'react';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { useGlobalUnhandledErrors } from '@k9-sak-web/gui/app/errorhandling/GlobalUnhandledErrorCatcher.js';
import { Alert } from '@navikt/ds-react';
import { AxiosError } from 'axios';

import styles from './RedigerFritekstbrev.module.css';

// Denne feilhandteringa bør endrast slik at ein ikkje henter ut feil frå global liste og filtrerer og lager spesialfeilmelding som her.
// Heile dialogen bør skrivast om til v2 og ikkje bruke rest-api, men tanstack query med lokal feilhandtering inni dialogen.
const FritekstFeilmeldinger = () => {
  const { globalErrors } = useGlobalUnhandledErrors();
  // Lag forståeleg(e) dedupliserte feilmeldinger viss det gjeld feila kall til formdling.
  const formidlingFeilmeldinger = [
    ...new Set(
      globalErrors.flatMap(error => {
        if (error instanceof AxiosError) {
          if (error.config?.url == '/k9/formidling/api/brev/forhaandsvis') {
            return [
              'Feil ved henting av forhåndsvisning. Du kan prøve igjen om litt eller melde fra om feil hvis det ikke løser seg.',
            ];
          }
          if (error.config?.url == '/k9/formidling/dokumentdata/api') {
            return [
              'Feil ved kommunikasjon med dokumentdata server. Du kan prøve igjen om litt eller melde fra om feil hvis det ikke løser seg.',
            ];
          }
        }
        return [];
      }),
    ),
  ];

  if (formidlingFeilmeldinger.length === 0) {
    return null;
  }

  return (
    <>
      <VerticalSpacer sixteenPx />
      <Alert variant="error" className={styles.alertMeldinger}>
        {formidlingFeilmeldinger.map((feilmelding, index) => {
          return <p key={index}>{feilmelding}</p>;
        })}
      </Alert>
      <VerticalSpacer sixteenPx />
    </>
  );
};

export default FritekstFeilmeldinger;
