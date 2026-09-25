import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Box, Heading } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { type JSX } from 'react';
import { IntlProvider } from 'react-intl';
import { useOmsorgenForOptions } from '../api/OmsorgenForQueries.js';
import styles from './omsorgenFor.module.css';
import Omsorgsperiodeoversikt from './Omsorgsperiodeoversikt.js';
import type { VurderingSubmitValues } from './types/VurderingSubmitValues.js';
import { teksterForSakstype } from './util/utils.js';

interface MainComponentProps {
  readOnly: boolean;
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: string[]) => Promise<void>;
  sakstype?: FagsakYtelsesType;
  behandlingUuid: string;
}

export const OmsorgenFor = ({ readOnly, onFinished, behandlingUuid, sakstype }: MainComponentProps): JSX.Element => {
  const { data: omsorgsperiodeoversikt } = useSuspenseQuery(useOmsorgenForOptions(behandlingUuid));

  return (
    <IntlProvider locale="nb-NO" messages={teksterForSakstype(sakstype)}>
      <Heading size="medium" level="1">
        {sakstype === fagsakYtelsesType.OMSORGSPENGER ? 'Omsorgen for' : 'Omsorg'}
      </Heading>
      <Box marginBlock="space-24 space-0">
        <div className={styles.mainComponent}>
          <Omsorgsperiodeoversikt
            omsorgsperiodeoversikt={omsorgsperiodeoversikt}
            sakstype={sakstype}
            readOnly={readOnly}
            onFinished={onFinished}
          />
        </div>
      </Box>
    </IntlProvider>
  );
};
