import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedVurderingsoversiktLinks from './mockedVurderingsoversiktLinks';
import createMockedVurderingselementLinks from './createMockedVurderingselementLinks';

const mockedToOmsorgspersonerVurderingsoversikt = {
  vurderingselementer: [
    {
      id: '11',
      periode: { fom: '2022-02-01', tom: '2022-02-15' } as any,
      resultat: Vurderingsresultat.OPPFYLT,
      gjelderForSøker: false,
      gjelderForAnnenPart: true,
      links: createMockedVurderingselementLinks('11'),
      endretIDenneBehandlingen: false,
      erInnleggelsesperiode: false,
    },
    {
      id: '22',
      periode: { fom: '2022-01-20', tom: '2022-01-31' } as any,
      resultat: Vurderingsresultat.OPPFYLT,
      gjelderForSøker: false,
      gjelderForAnnenPart: true,
      links: createMockedVurderingselementLinks('22'),
      endretIDenneBehandlingen: false,
      erInnleggelsesperiode: true,
    },
    {
      id: '33',
      periode: { fom: '2022-01-15', tom: '2022-01-19' } as any,
      resultat: Vurderingsresultat.IKKE_OPPFYLT,
      gjelderForSøker: false,
      gjelderForAnnenPart: true,
      links: createMockedVurderingselementLinks('33'),
      endretIDenneBehandlingen: false,
      erInnleggelsesperiode: true,
    },
    {
      id: '55',
      periode: { fom: '2022-01-01', tom: '2022-01-14' } as any,
      erInnleggelsesperiode: true,
    },
  ],
  resterendeVurderingsperioder: [{ fom: '2022-02-16', tom: '2022-03-01' } as any],
  perioderSomKanVurderes: [{ fom: '2022-01-15', tom: '2022-03-01' } as any],
  resterendeValgfrieVurderingsperioder: [{ fom: '2022-01-15', tom: '2022-03-01' } as any],
  søknadsperioderTilBehandling: [],
  links: mockedVurderingsoversiktLinks,
  pleietrengendesFødselsdato: '2021-04-27',
  harPerioderDerPleietrengendeErOver18år: true,
};

export default mockedToOmsorgspersonerVurderingsoversikt;
