import { Alert, Box } from '@navikt/ds-react';
import { type JSX } from 'react';
import { FormattedMessage } from 'react-intl';
import Omsorgsperiodeoversikt from '../../../types/Omsorgsperiodeoversikt';
import { getStringMedPerioder } from '../../../util/periodUtils';
import styles from './omsorgsperiodeoversiktMessages.module.css';
import { useOmsorgenForContext } from '../../context/ContainerContext';
import { AksjonspunktStatus } from '@k9-sak-web/gui/storybook/mocks/uttak/uttakStoryMocks.js';

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
    omsorgenForAksjonspunkt?.status?.kode === AksjonspunktStatus.OPPRETTET
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
