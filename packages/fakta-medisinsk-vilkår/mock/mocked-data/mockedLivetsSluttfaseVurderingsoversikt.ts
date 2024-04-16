import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';

const livetsSluttfaseVurderingsoversiktMock = {
  vurderingselementer: [],
  resterendeVurderingsperioder: [{ fom: '2022-02-16', tom: '2022-03-01' } as any],
  resterendeValgfrieVurderingsperioder: [],
  søknadsperioderTilBehandling: [],
  perioderSomKanVurderes: [{ fom: '2022-02-01', tom: '2022-03-01' } as any],
  links: mockedVurderingsoversiktLinks,
  pleietrengendesFødselsdato: '2004-02-28',
};

export default livetsSluttfaseVurderingsoversiktMock;
