import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';

const livetsSluttfaseVurderingerMock = [
  {
    id: '1',
    type: 'LIVETS_SLUTTFASE',
    versjoner: [
      {
        perioder: [{ fom: '2022-02-01', tom: '2022-02-15' } as any],
        resultat: Vurderingsresultat.OPPFYLT,
        dokumenter: mockedDokumentliste,
        tekst: 'Fordi her er det behov',
        endretAv: 'Z199493',
        endretTidspunkt: '2021-10-20T13:23:44.995',
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
  },
];

export default livetsSluttfaseVurderingerMock;
