import React from 'react';
import ContainerContract from '../../types/ContainerContract';

const ContainerContext = React.createContext<ContainerContract>({
  endpoints: {
    vurderingsoversiktKontinuerligTilsynOgPleie: '',
    vurderingsoversiktBehovForToOmsorgspersoner: '',
    vurderingsoversiktLivetsSluttfase: undefined,
    vurderingsoversiktLangvarigSykdom: undefined,
    dokumentoversikt: '',
    innleggelsesperioder: '',
    diagnosekoder: '',
    dataTilVurdering: '',
    status: '',
    nyeDokumenter: '',
  },
  behandlingUuid: '',
  readOnly: false,
  onFinished: () => {
    throw new Error('Function not implemented.');
  },
  httpErrorHandler: () => {
    throw new Error('Function not implemented.');
  },
  visFortsettknapp: false,
});
export default ContainerContext;
