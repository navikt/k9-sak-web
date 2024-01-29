import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import Alertstripe from 'nav-frontend-alertstriper';
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
        <Alertstripe type="advarsel" className={styles.alertstripe}>
          <FormattedMessage id="vurdering.advarsel" values={{ perioder: getStringMedPerioder(perioderTilVurdering) }} />
        </Alertstripe>
      </Box>
    );
  }
  return null;
};

export default OmsorgsperiodeoversiktMessages;
