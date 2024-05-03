import { Period, get } from '@k9-sak-web/utils';
import { PageContainer } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import ContainerContext from '../context/ContainerContext';
import ContainerContract from '../types/ContainerContract';
import { Kompletthet as KompletthetData } from '../types/KompletthetData';
import { Kompletthet as KompletthetResponse } from '../types/KompletthetResponse';
import ActionType from './actionTypes';
import Kompletthetsoversikt from './components/kompletthetsoversikt/Kompletthetsoversikt';
import mainComponentReducer from './reducer';

function initKompletthetsdata({ tilstand }: KompletthetResponse): KompletthetData {
  return {
    tilstand: tilstand.map(({ periode, status, begrunnelse, tilVurdering, vurdering }) => {
      const [fom, tom] = periode.split('/');
      return {
        periode: new Period(fom, tom),
        status,
        begrunnelse,
        tilVurdering,
        vurdering,
        periodeOpprinneligFormat: periode,
      };
    }),
  };
}

interface MainComponentProps {
  data: ContainerContract;
}

const MainComponent = ({ data }: MainComponentProps): JSX.Element => {
  const [state, dispatch] = React.useReducer(mainComponentReducer, {
    isLoading: true,
    kompletthetsoversiktHarFeilet: false,
    kompletthetsoversiktResponse: null,
  });

  const controller = React.useMemo(() => new AbortController(), []);
  const { kompletthetsoversiktResponse, isLoading, kompletthetsoversiktHarFeilet } = state;
  const { endpoints, onFinished, httpErrorHandler } = data;

  const getKompletthetsoversikt = () =>
    get<KompletthetResponse>(endpoints.kompletthetBeregning, httpErrorHandler, {
      signal: controller.signal,
    });

  const handleError = () => {
    dispatch({ type: ActionType.FAILED });
  };

  React.useEffect(() => {
    let isMounted = true;
    getKompletthetsoversikt()
      .then((response: KompletthetResponse) => {
        if (isMounted) {
          dispatch({ type: ActionType.OK, kompletthetsoversiktResponse: response });
        }
      })
      .catch(handleError);
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <ContainerContext.Provider value={data}>
      <PageContainer isLoading={isLoading} hasError={kompletthetsoversiktHarFeilet}>
        {kompletthetsoversiktResponse && (
          <Kompletthetsoversikt
            kompletthetsoversikt={initKompletthetsdata(kompletthetsoversiktResponse)}
            onFormSubmit={payload => {
              onFinished(payload);
            }}
          />
        )}
      </PageContainer>
    </ContainerContext.Provider>
  );
};

export default MainComponent;
