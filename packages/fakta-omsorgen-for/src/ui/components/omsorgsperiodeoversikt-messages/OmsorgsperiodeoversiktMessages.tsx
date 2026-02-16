import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';
import { Alert, Box } from '@navikt/ds-react';
import type { JSX } from 'react';
import { FormattedMessage } from 'react-intl';
import type Omsorgsperiodeoversikt from '../../../types/Omsorgsperiodeoversikt';
import { getStringMedPerioder } from '../../../util/periodUtils';
import { useOmsorgenForContext } from '../../context/ContainerContext';
import styles from './omsorgsperiodeoversiktMessages.module.css';

interface OmsorgsperiodeoversiktMessagesProps {
  omsorgsperiodeoversikt: Omsorgsperiodeoversikt;
}

const OmsorgsperiodeoversiktMessages = ({
  omsorgsperiodeoversikt,
}: OmsorgsperiodeoversiktMessagesProps): JSX.Element | null => {
  const { readOnly, omsorgenForAksjonspunkt } = useOmsorgenForContext();
  if (
    omsorgsperiodeoversikt.harPerioderTilVurdering() &&
    !readOnly &&
    isAksjonspunktOpen(omsorgenForAksjonspunkt?.status?.kode)
  ) {
    const perioderTilVurdering = omsorgsperiodeoversikt.finnPerioderTilVurdering().map(({ periode }) => periode);
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
