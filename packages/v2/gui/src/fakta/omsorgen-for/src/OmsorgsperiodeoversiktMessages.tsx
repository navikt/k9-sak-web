import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { OmsorgenForOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/OmsorgenForOversiktDto.js';
import { Alert, Box } from '@navikt/ds-react';
import styles from './omsorgsperiodeoversiktMessages.module.css';
import { getStringMedPerioder } from './util/periodUtils.js';
import { finnPerioderTilVurdering, harPerioderTilVurdering } from './util/utils.js';

interface OmsorgsperiodeoversiktMessagesProps {
  omsorgsperiodeoversikt: OmsorgenForOversiktDto;
  readOnly: boolean;
  sakstype?: FagsakYtelsesType;
}

const OmsorgsperiodeoversiktMessages = ({
  omsorgsperiodeoversikt,
  readOnly,
  sakstype,
}: OmsorgsperiodeoversiktMessagesProps) => {
  if (!readOnly && harPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder)) {
    const perioderTilVurdering = finnPerioderTilVurdering(omsorgsperiodeoversikt.omsorgsperioder)
      .map(({ periode }) => periode)
      .filter(periode => periode !== undefined);
    const advarsel =
      sakstype === fagsakYtelsesType.OMSORGSPENGER
        ? 'Vurder om søker har omsorgen for barn i perioden.'
        : sakstype === fagsakYtelsesType.OPPLÆRINGSPENGER
          ? 'Vurder om søker har omsorgen for barnet i perioden.'
          : `Vurder om søker har omsorgen for barnet i ${getStringMedPerioder(perioderTilVurdering)}.`;
    return (
      <Box marginBlock="space-0 space-24">
        <Alert size="small" variant="warning" className={styles.alertstripe}>
          {advarsel}
        </Alert>
      </Box>
    );
  }
  return null;
};

export default OmsorgsperiodeoversiktMessages;
