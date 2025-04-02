import { Alert } from '@navikt/ds-react';
import { Box } from '@navikt/ft-plattform-komponenter';
import { type JSX } from 'react';
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
      <Box marginBlock="0 6">
        <Alert size="small" variant="warning" className={styles.alertstripe}>
          <FormattedMessage id="vurdering.advarsel" values={{ perioder: getStringMedPerioder(perioderTilVurdering) }} />
        </Alert>
      </Box>
    );
  }
  return null;
};

export default OmsorgsperiodeoversiktMessages;
