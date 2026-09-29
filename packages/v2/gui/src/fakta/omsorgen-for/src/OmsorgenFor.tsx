import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { NorskIdentDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorg/NorskIdentDto.js';
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
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: NorskIdentDto[]) => Promise<void>;
  sakstype?: FagsakYtelsesType;
  behandlingUuid: string;
  behandlingVersjon: number;
}

export const OmsorgenFor = ({
  readOnly,
  onFinished,
  behandlingUuid,
  behandlingVersjon,
  sakstype,
}: MainComponentProps): JSX.Element => {
  const { data: omsorgsperiodeoversikt } = useSuspenseQuery(useOmsorgenForOptions(behandlingUuid, behandlingVersjon));

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
