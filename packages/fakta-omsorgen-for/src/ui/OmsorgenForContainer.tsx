import { get } from '@fpsak-frontend/utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Box } from '@navikt/ds-react';
import { PageContainer } from '@navikt/ft-plattform-komponenter';
import React, { type JSX } from 'react';
import { IntlProvider } from 'react-intl';
import { ContainerContract } from '../types/ContainerContract';
import OmsorgsperiodeoversiktType from '../types/Omsorgsperiodeoversikt';
import OmsorgsperioderResponse from '../types/OmsorgsperioderResponse';
import { teksterForSakstype } from '../util/utils';
import ActionType from './actionTypes';
import Omsorgsperiodeoversikt from './components/omsorgsperiodeoversikt/Omsorgsperiodeoversikt';
import ContainerContext from './context/ContainerContext';
import styles from './mainComponent.module.css';
import mainComponentReducer from './reducer';

interface MainComponentProps {
  data: ContainerContract;
}

const OmsorgenForContainer = ({ data }: MainComponentProps): JSX.Element => {
  const { sakstype } = data;
  const [state, dispatch] = React.useReducer(mainComponentReducer, {
    isLoading: true,
    omsorgsperiodeoversiktHarFeilet: false,
    omsorgsperiodeoversikt: null,
  });

  const { omsorgsperiodeoversikt, isLoading, omsorgsperiodeoversiktHarFeilet } = state;

  const controller = React.useMemo(() => new AbortController(), []);

  const getOmsorgsperioder = () =>
    get<OmsorgsperioderResponse>(data.endpoints.omsorgsperioder, data.httpErrorHandler, {
      signal: controller.signal,
    });

  const handleError = () => {
    dispatch({ type: ActionType.FAILED });
  };

  React.useEffect(() => {
    let isMounted = true;
    getOmsorgsperioder()
      .then((response: OmsorgsperioderResponse) => {
        if (isMounted) {
          const nyOmsorgsperiodeoversikt = new OmsorgsperiodeoversiktType(response);
          dispatch({ type: ActionType.OK, omsorgsperiodeoversikt: nyOmsorgsperiodeoversikt });
        }
      })
      .catch(handleError);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <IntlProvider locale="nb-NO" messages={teksterForSakstype(sakstype)}>
      <ContainerContext.Provider value={data}>
        <h1 style={{ fontSize: 22 }}>{sakstype === fagsakYtelsesType.OMSORGSPENGER ? 'Omsorgen for' : 'Omsorg'}</h1>
        <Box marginBlock="6 0">
          <PageContainer isLoading={isLoading} hasError={omsorgsperiodeoversiktHarFeilet}>
            <div className={styles.mainComponent}>
              <Omsorgsperiodeoversikt omsorgsperiodeoversikt={omsorgsperiodeoversikt} />
            </div>
          </PageContainer>
        </Box>
      </ContainerContext.Provider>
    </IntlProvider>
  );
};

export default OmsorgenForContainer;
