import { Alert } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Omsorgsperiodeoversikt from '../../../types/Omsorgsperiodeoversikt';
import { getStringMedPerioder } from '../../../util/periodUtils';
import styles from './omsorgsperiodeoversiktMessages.module.css';

interface OmsorgsperiodeoversiktMessagesProps {
  omsorgsperiodeoversikt: Omsorgsperiodeoversikt;
}

const OmsorgsperiodeoversiktMessages = ({
  omsorgsperiodeoversikt,
}: OmsorgsperiodeoversiktMessagesProps): JSX.Element => {
  if (omsorgsperiodeoversikt.harPerioderTilVurdering()) {
    const perioderTilVurdering = omsorgsperiodeoversikt.finnPerioderTilVurdering().map(({ periode }) => periode);
    return (
      <Box marginBottom={Margin.large}>
        <Alert size="small" variant="warning" className={styles.alertstripe}>
          <FormattedMessage id="vurdering.advarsel" values={{ perioder: getStringMedPerioder(perioderTilVurdering) }} />
        </Alert>
      </Box>
    );
  }
  return null;
};

export default OmsorgsperiodeoversiktMessages;
