import { Alert, Box } from '@navikt/ds-react';
import { type JSX } from 'react';
import { FormattedMessage } from 'react-intl';
import Omsorgsperiodeoversikt from '../../../types/Omsorgsperiodeoversikt';
import { getStringMedPerioder } from '../../../util/periodUtils';
import styles from './omsorgsperiodeoversiktMessages.module.css';
import { useOmsorgenForContext } from '../../context/ContainerContext';
import { isAksjonspunktOpen } from '@k9-sak-web/gui/utils/aksjonspunktUtils.js';

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
