import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';
import createMockedVurderingselementLinks from './createMockedVurderingselementLinks';

const tilsynsbehovVurderingsoversiktMock = {
  vurderingselementer: [
    {
      id: '1',
      periode: { fom: '2022-02-01', tom: '2022-02-15' } as any,
      resultat: Vurderingsresultat.OPPFYLT,
      gjelderForSøker: false,
      gjelderForAnnenPart: true,
      links: createMockedVurderingselementLinks('1'),
      endretIDenneBehandlingen: false,
      erInnleggelsesperiode: false,
    },
    {
      id: '2',
      periode: { fom: '2022-01-20', tom: '2022-01-31' } as any,
      resultat: Vurderingsresultat.OPPFYLT,
      gjelderForSøker: false,
      gjelderForAnnenPart: true,
      links: createMockedVurderingselementLinks('2'),
      endretIDenneBehandlingen: false,
      erInnleggelsesperiode: true,
    },
    {
      id: '3',
      periode: { fom: '2022-01-15', tom: '2020-01-19' } as any,
      resultat: Vurderingsresultat.IKKE_OPPFYLT,
      gjelderForSøker: false,
      gjelderForAnnenPart: true,
      links: createMockedVurderingselementLinks('3'),
      endretIDenneBehandlingen: false,
      erInnleggelsesperiode: true,
    },
    {
      id: '4',
      periode: { fom: '2022-01-01', tom: '2020-01-14' } as any,
      erInnleggelsesperiode: true,
    },
  ],
  resterendeVurderingsperioder: [{ fom: '2022-02-16', tom: '2022-03-01' } as any],
  perioderSomKanVurderes: [{ fom: '2022-01-15', tom: '2022-03-01' } as any],
  resterendeValgfrieVurderingsperioder: [],
  søknadsperioderTilBehandling: [],
  links: mockedVurderingsoversiktLinks,
  pleietrengendesFødselsdato: '2004-02-28',
  harPerioderDerPleietrengendeErOver18år: true,
};

export default tilsynsbehovVurderingsoversiktMock;
