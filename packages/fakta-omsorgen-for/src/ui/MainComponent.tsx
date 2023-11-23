import { Box, Margin, PageContainer } from '@navikt/ft-plattform-komponenter';
import { get } from '@fpsak-frontend/utils';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ContainerContract } from '../types/ContainerContract';
import OmsorgsperiodeoversiktType from '../types/Omsorgsperiodeoversikt';
import OmsorgsperioderResponse from '../types/OmsorgsperioderResponse';
import Ytelsestype from '../types/Ytelsestype';
import { teksterForSakstype } from '../util/utils';
import ActionType from './actionTypes';
import Omsorgsperiodeoversikt from './components/omsorgsperiodeoversikt/Omsorgsperiodeoversikt';
import ContainerContext from './context/ContainerContext';
import styles from './mainComponent.css';
import mainComponentReducer from './reducer';

interface MainComponentProps {
  data: ContainerContract;
}

const MainComponent = ({ data }: MainComponentProps): JSX.Element => {
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
        <h1 style={{ fontSize: 22 }}>{sakstype === Ytelsestype.OMP ? 'Omsorgen for' : 'Omsorg'}</h1>
        <Box marginTop={Margin.large}>
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

export default MainComponent;
