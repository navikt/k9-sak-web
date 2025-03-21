import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Personopplysninger } from '@k9-sak-web/types';
import BehandlingType from '../constants/BehandlingType';

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
  fagsakYtelseType?: FagsakYtelsesType;
  behandlingType?: BehandlingType;
  pleietrengendePart?: Personopplysninger['pleietrengendePart'];
}

export default ContainerContract;
