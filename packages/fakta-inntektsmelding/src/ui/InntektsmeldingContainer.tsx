import { get, Period } from '@fpsak-frontend/utils';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import React, { type ReactElement } from 'react';
import ContainerContext from '../context/ContainerContext';
import type ContainerContract from '../types/ContainerContract';
import type { Kompletthet as KompletthetData } from '../types/KompletthetData';
import type { Kompletthet as KompletthetResponse } from '../types/KompletthetResponse';
import ActionType from './actionTypes';
import Kompletthetsoversikt from './components/kompletthetsoversikt/Kompletthetsoversikt';
import mainComponentReducer from './reducer';

function initKompletthetsdata({ tilstand }: KompletthetResponse): KompletthetData {
  return {
    tilstand: tilstand.map(({ periode, status, begrunnelse, tilVurdering, vurdering, vurdertAv, vurdertTidspunkt }) => {
      const [fom, tom] = periode.split('/');
      return {
        periode: new Period(fom, tom),
        status,
        begrunnelse,
        tilVurdering,
        vurdering,
        periodeOpprinneligFormat: periode,
        vurdertAv,
        vurdertTidspunkt,
      };
    }),
  };
}

export interface InntektsmeldingApi {
  getKompletthetsoversikt: (
    endpoint: string,
    httpErrorHandler: any,
    signal?: AbortSignal,
  ) => Promise<KompletthetResponse>;
}

const defaultApi: InntektsmeldingApi = {
  getKompletthetsoversikt: (endpoint, httpErrorHandler, signal) =>
    get<KompletthetResponse>(endpoint, httpErrorHandler, {
      signal,
    }),
};

export interface MainComponentProps {
  data: ContainerContract;
  requestApi?: InntektsmeldingApi;
}

const InntektsmeldingContainer = ({ data, requestApi = defaultApi }: MainComponentProps): ReactElement<any> => {
  const [state, dispatch] = React.useReducer(mainComponentReducer, {
    isLoading: true,
    kompletthetsoversiktHarFeilet: false,
    kompletthetsoversiktResponse: null,
  });

  const controller = React.useMemo(() => new AbortController(), []);
  const { endpoints, onFinished, httpErrorHandler } = data;

  const getKompletthetsoversikt = () =>
    requestApi.getKompletthetsoversikt(endpoints.kompletthetBeregning, httpErrorHandler, controller.signal);

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

  const { kompletthetsoversiktResponse, isLoading, kompletthetsoversiktHarFeilet } = state;

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

export default InntektsmeldingContainer;
