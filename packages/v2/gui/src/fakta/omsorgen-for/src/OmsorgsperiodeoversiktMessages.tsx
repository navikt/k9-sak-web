import type { k9_sak_kontrakt_omsorg_OmsorgenForOversiktDto as OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Alert, Box } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import styles from './omsorgsperiodeoversiktMessages.module.css';
import { getStringMedPerioder } from './util/periodUtils';
import { finnPerioderTilVurdering, harPerioderTilVurdering } from './util/utils';

interface OmsorgsperiodeoversiktMessagesProps {
  omsorgsperiodeoversikt: OmsorgenForOversiktDto;
}

const OmsorgsperiodeoversiktMessages = ({ omsorgsperiodeoversikt }: OmsorgsperiodeoversiktMessagesProps) => {
  if (harPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder)) {
    const perioderTilVurdering = finnPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder)
      .map(({ periode }) => periode)
      .filter(periode => periode !== undefined);
    return (
      <Box.New marginBlock="0 6">
        <Alert size="small" variant="warning" className={styles.alertstripe}>
          <FormattedMessage id="vurdering.advarsel" values={{ perioder: getStringMedPerioder(perioderTilVurdering) }} />
        </Alert>
      </Box.New>
    );
  }
  return null;
};

export default OmsorgsperiodeoversiktMessages;
