import { FlexColumn, FlexContainer, FlexRow, Image } from '@fpsak-frontend/shared-components';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import styles from './tittelMedDivider.module.css';

interface OwnProps {
  imageSrc: string;
  tittel: string;
}

/**
 * TittelMedDivider
 *
 * Presentasjonskomponent. Viser et ikon og en tittel skilt med en vertikal grå linje.
 */
const TittelMedDivider = ({ imageSrc, tittel }: OwnProps) => {
  const intl = useIntl();
  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <Image
            src={imageSrc}
            alt={intl.formatMessage({ id: 'Risikopanel.Tittel' })}
            tooltip={intl.formatMessage({ id: 'Risikopanel.Tittel' })}
          />
        </FlexColumn>
        <FlexColumn>
          <div className={styles.divider} />
        </FlexColumn>
        <FlexColumn>
          <div className={styles.tekst}>
            <BodyShort size="small">
              <FormattedMessage id={tittel} />
            </BodyShort>
          </div>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  );
};

export default TittelMedDivider;
