import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { Box } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { type JSX } from 'react';
import { IntlProvider } from 'react-intl';
import type { OmsorgenForBackendApiType } from '../OmsorgenForBackendApiType';
import styles from './omsorgenFor.module.css';
import Omsorgsperiodeoversikt from './Omsorgsperiodeoversikt';
import type { VurderingSubmitValues } from './types/VurderingSubmitValues';
import { teksterForSakstype } from './util/utils';

interface MainComponentProps {
  api: OmsorgenForBackendApiType;
  readOnly: boolean;
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: string[]) => Promise<void>;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  sakstype?: FagsakYtelsesType;
  behandlingUuid: string;
}

const OmsorgenFor = ({
  api,
  readOnly,
  onFinished,
  httpErrorHandler,
  behandlingUuid,
  sakstype,
}: MainComponentProps): JSX.Element => {
  const {
    data: omsorgsperiodeoversikt,
    isFetching: isLoading,
    isError: omsorgsperiodeoversiktHarFeilet,
  } = useQuery({
    queryKey: ['omsorgsperiodeoversikt', behandlingUuid],
    queryFn: () =>
      api.getOmsorgsperioder(behandlingUuid).catch(error => {
        httpErrorHandler(error.status, error.headers.get('Location'));
        throw error;
      }),
  });

  return (
    <IntlProvider locale="nb-NO" messages={teksterForSakstype(sakstype)}>
      <h1 style={{ fontSize: 22 }}>{sakstype === fagsakYtelsesType.OMSORGSPENGER ? 'Omsorgen for' : 'Omsorg'}</h1>
      <Box.New marginBlock="6 0">
        <PageContainer isLoading={isLoading} hasError={omsorgsperiodeoversiktHarFeilet}>
          <div className={styles.mainComponent}>
            {omsorgsperiodeoversikt && (
              <Omsorgsperiodeoversikt
                omsorgsperiodeoversikt={omsorgsperiodeoversikt}
                sakstype={sakstype}
                readOnly={readOnly}
                onFinished={onFinished}
              />
            )}
          </div>
        </PageContainer>
      </Box.New>
    </IntlProvider>
  );
};

export default OmsorgenFor;
