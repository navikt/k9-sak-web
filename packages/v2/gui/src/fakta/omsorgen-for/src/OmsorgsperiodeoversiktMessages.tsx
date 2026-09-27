import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';
import { Alert, Box } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import styles from './omsorgsperiodeoversiktMessages.module.css';
import { getStringMedPerioder } from './util/periodUtils';
import { finnPerioderTilVurdering, harPerioderTilVurdering } from './util/utils';

interface OmsorgsperiodeoversiktMessagesProps {
  omsorgsperiodeoversikt: OmsorgenForOversiktDto;
  readOnly: boolean;
}

const OmsorgsperiodeoversiktMessages = ({ omsorgsperiodeoversikt, readOnly }: OmsorgsperiodeoversiktMessagesProps) => {
  if (!readOnly && harPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder)) {
    const perioderTilVurdering = finnPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder)
      .map(({ periode }) => periode)
      .filter(periode => periode !== undefined);
    return (
      <Box marginBlock="space-0 space-24">
        <Alert size="small" variant="warning" className={styles.alertstripe}>
          <FormattedMessage id="vurdering.advarsel" values={{ perioder: getStringMedPerioder(perioderTilVurdering) }} />
        </Alert>
      </Box>
    );
  }
  return null;
};

export default OmsorgsperiodeoversiktMessages;
