import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { PageContainer } from '@k9-sak-web/gui/shared/pageContainer/PageContainer.js';
import { Box } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { type JSX } from 'react';
import { IntlProvider } from 'react-intl';
import styles from './mainComponent.module.css';
import OmsorgenForBackendClient from './OmsorgenForBackendClient';
import Omsorgsperiodeoversikt from './src/Omsorgsperiodeoversikt';
import type { VurderingSubmitValues } from './src/types/VurderingSubmitValues';
import { teksterForSakstype } from './src/util/utils';

interface MainComponentProps {
  readOnly: boolean;
  onFinished: (vurdering: VurderingSubmitValues[], fosterbarnForOmsorgspenger?: string[]) => void;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  sakstype?: FagsakYtelsesType;
  behandlingUuid: string;
}

const OmsorgenForContainer = ({
  readOnly,
  onFinished,
  httpErrorHandler,
  behandlingUuid,
  sakstype,
}: MainComponentProps): JSX.Element => {
  const omsorgenForBackendClient = new OmsorgenForBackendClient();
  const {
    data: omsorgsperiodeoversikt,
    isFetching: isLoading,
    isError: omsorgsperiodeoversiktHarFeilet,
  } = useQuery({
    queryKey: ['omsorgsperiodeoversikt', behandlingUuid],
    queryFn: () =>
      omsorgenForBackendClient.getOmsorgsperioder(behandlingUuid).catch(error => {
        httpErrorHandler(error.status, error.headers.get('Location'));
        throw error;
      }),
  });
  // const { sakstype } = data;
  // const [state, dispatch] = React.useReducer(mainComponentReducer, {
  //   isLoading: true,
  //   omsorgsperiodeoversiktHarFeilet: false,
  //   omsorgsperiodeoversikt: null,
  // });

  // const { omsorgsperiodeoversikt, isLoading, omsorgsperiodeoversiktHarFeilet } = state;

  // const controller = React.useMemo(() => new AbortController(), []);

  // const getOmsorgsperioder = () =>
  //   get<OmsorgsperioderResponse>(data.endpoints.omsorgsperioder, data.httpErrorHandler, {
  //     signal: controller.signal,
  //   });

  // const handleError = () => {
  //   dispatch({ type: ActionType.FAILED });
  // };

  // React.useEffect(() => {
  //   let isMounted = true;
  //   getOmsorgsperioder()
  //     .then((response: OmsorgsperioderResponse) => {
  //       if (isMounted) {
  //         const nyOmsorgsperiodeoversikt = new OmsorgsperiodeoversiktType(response);
  //         dispatch({ type: ActionType.OK, omsorgsperiodeoversikt: nyOmsorgsperiodeoversikt });
  //       }
  //     })
  //     .catch(handleError);
  //   return () => {
  //     isMounted = false;
  //     controller.abort();
  //   };
  // }, []);

  return (
    <IntlProvider locale="nb-NO" messages={teksterForSakstype(sakstype)}>
      {/* <ContainerContext.Provider value={data}> */}
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
      {/* </ContainerContext.Provider> */}
    </IntlProvider>
  );
};

export default OmsorgenForContainer;
