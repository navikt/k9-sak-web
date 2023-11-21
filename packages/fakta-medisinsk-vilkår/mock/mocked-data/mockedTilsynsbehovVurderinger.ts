import Vurderingsresultat from '../../src/types/Vurderingsresultat';
import mockedDokumentliste from './mockedDokumentliste';

const tilsynsbehovVurderingerMock = [
  {
    id: '1',
    type: 'KONTINUERLIG_TILSYN_OG_PLEIE',
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
    erInnleggelsesperiode: false,
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
  },
  {
    id: '2',
    type: 'KONTINUERLIG_TILSYN_OG_PLEIE',
    versjoner: [
      {
        perioder: [{ fom: '2022-01-20', tom: '2022-01-31' } as any],
        resultat: Vurderingsresultat.OPPFYLT,
        dokumenter: mockedDokumentliste,
        tekst: 'Fordi her er det behov',
      },
    ],
    erInnleggelsesperiode: true,
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
  },
  {
    id: '3',
    type: 'KONTINUERLIG_TILSYN_OG_PLEIE',
    versjoner: [
      {
        perioder: [{ fom: '2022-01-15', tom: '2022-01-19' } as any],
        resultat: Vurderingsresultat.IKKE_OPPFYLT,
        dokumenter: mockedDokumentliste,
        tekst: 'Fordi her er det behov',
      },
    ],
    erInnleggelsesperiode: true,
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
  },
];

export default tilsynsbehovVurderingerMock;
