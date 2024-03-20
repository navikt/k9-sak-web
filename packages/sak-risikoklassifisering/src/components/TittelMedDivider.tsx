import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { FlexColumn, FlexContainer, FlexRow, Image } from '@fpsak-frontend/shared-components';

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
            <Normaltekst>
              <FormattedMessage id={tittel} />
            </Normaltekst>
          </div>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  );
};

export default TittelMedDivider;
