import { get } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { Box } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { type JSX } from 'react';
import { IntlProvider } from 'react-intl';
import { ContainerContract } from '../types/ContainerContract';
import OmsorgsperiodeoversiktType from '../types/Omsorgsperiodeoversikt';
import OmsorgsperioderResponse from '../types/OmsorgsperioderResponse';
import { teksterForSakstype } from '../util/utils';
import Omsorgsperiodeoversikt from './components/omsorgsperiodeoversikt/Omsorgsperiodeoversikt';
import ContainerContext from './context/ContainerContext';
import styles from './mainComponent.module.css';

interface MainComponentProps {
  data: ContainerContract;
}

const OmsorgenForContainer = ({ data }: MainComponentProps): JSX.Element => {
  const { sakstype } = data;

  const {
    data: omsorgsperiodeoversikt,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['omsorgsperiodeoversikt', data.endpoints.omsorgsperioder, data.httpErrorHandler],
    queryFn: async ({ signal }) => {
      const response = await get<OmsorgsperioderResponse>(data.endpoints.omsorgsperioder, data.httpErrorHandler, {
        signal,
      });
      const nyOmsorgsperiodeoversikt = new OmsorgsperiodeoversiktType(response);
      return nyOmsorgsperiodeoversikt;
    },
  });

  return (
    <IntlProvider locale="nb-NO" messages={teksterForSakstype(sakstype)}>
      <ContainerContext.Provider value={data}>
        <h1 style={{ fontSize: 22 }}>{sakstype === fagsakYtelsesType.OMSORGSPENGER ? 'Omsorgen for' : 'Omsorg'}</h1>
        <Box marginBlock="6 0">
          <PageContainer isLoading={isLoading} hasError={isError}>
            <div className={styles.mainComponent}>
              {omsorgsperiodeoversikt && <Omsorgsperiodeoversikt omsorgsperiodeoversikt={omsorgsperiodeoversikt} />}
            </div>
          </PageContainer>
        </Box>
      </ContainerContext.Provider>
    </IntlProvider>
  );
};

export default OmsorgenForContainer;
