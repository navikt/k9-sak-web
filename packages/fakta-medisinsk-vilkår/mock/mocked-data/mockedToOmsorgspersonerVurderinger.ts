import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';
import Vurderingstype from '../../src/types/Vurderingstype';

const toOmsorgspersonerVurderingerMock = [
  {
    id: '11',
    type: 'TO_OMSORGSPERSONER',
    versjoner: [
      {
        perioder: [{ fom: '2022-02-01', tom: '2020-02-15' } as any],
        resultat: Vurderingsresultat.OPPFYLT,
        dokumenter: mockedDokumentliste,
        tekst: 'Fordi her er det behov',
        endretAv: 'Z133337',
        endretTidspunkt: '2021-10-20T13:23:44.995',
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
    erInnleggelsesperiode: false,
  },
  {
    id: '22',
    type: 'TO_OMSORGSPERSONER',
    versjoner: [
      {
        perioder: [{ fom: '2022-01-20', tom: '2022-01-31' } as any],
        resultat: Vurderingsresultat.OPPFYLT,
        dokumenter: mockedDokumentliste,
        tekst: 'Fordi her er det ikke behov',
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
    erInnleggelsesperiode: true,
  },
  {
    id: '33',
    type: 'TO_OMSORGSPERSONER',
    versjoner: [
      {
        perioder: [{ fom: '2022-01-15', tom: '2022-01-19' } as any],
        resultat: Vurderingsresultat.IKKE_OPPFYLT,
        dokumenter: mockedDokumentliste,
        tekst: 'Fordi her er det ikke behov',
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
    erInnleggelsesperiode: true,
  },
];

export default toOmsorgspersonerVurderingerMock;
