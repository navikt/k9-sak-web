import BehandlingType from '../constants/BehandlingType';
import FagsakYtelseType from '../constants/FagsakYtelseType';

interface ContainerContract {
  endpoints: {
    vurderingsoversiktKontinuerligTilsynOgPleie: string;
    vurderingsoversiktBehovForToOmsorgspersoner: string;
    vurderingsoversiktLivetsSluttfase?: string;
    vurderingsoversiktLangvarigSykdom?: string;
    dokumentoversikt: string;
    innleggelsesperioder: string;
    diagnosekoder: string;
    dataTilVurdering: string;
    status: string;
    nyeDokumenter: string;
  };
  behandlingUuid: string;
  readOnly: boolean;
  onFinished: (...args: unknown[]) => void;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  visFortsettknapp: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saksbehandlere: any;
  fagsakYtelseType?: FagsakYtelseType;
  behandlingType?: BehandlingType;
}

export default ContainerContract;
