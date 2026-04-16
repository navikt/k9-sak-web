import tilsynsbehovVurderingerMock from './mocked-data/mockedTilsynsbehovVurderinger';
import tilsynsbehovVurderingsoversiktMock from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';
import toOmsorgspersonerVurderingerMock from './mocked-data/mockedToOmsorgspersonerVurderinger';
import createMockedVurderingselementLinks from './mocked-data/createMockedVurderingselementLinks';
import NyVurderingsversjon from '../src/types/NyVurderingsversjon';
import mockedDokumentliste from './mocked-data/mockedDokumentliste';
import livetsSluttfaseVurderingsoversiktMock from './mocked-data/mockedLivetsSluttfaseVurderingsoversikt';
import livetsSluttfaseVurderingerMock from './mocked-data/mockedLivetsSluttfaseVurderinger';

export const createKontinuerligTilsynVurdering = (requestBody: NyVurderingsversjon) => {
  const nyVurderingId = tilsynsbehovVurderingsoversiktMock.vurderingselementer.length + 1;
  const { type, perioder, resultat, tekst } = requestBody;

  tilsynsbehovVurderingsoversiktMock.vurderingselementer.push({
    id: `${nyVurderingId}`,
    periode: perioder[0],
    resultat,
    gjelderForSøker: true,
    gjelderForAnnenPart: false,
    links: createMockedVurderingselementLinks(nyVurderingId),
    endretIDenneBehandlingen: true,
    erInnleggelsesperiode: false,
  });
  tilsynsbehovVurderingsoversiktMock.resterendeVurderingsperioder = [];
  tilsynsbehovVurderingerMock.push({
    id: `${nyVurderingId}`,
    type,
    versjoner: [
      {
        perioder,
        resultat,
        dokumenter: mockedDokumentliste,
        tekst,
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
    erInnleggelsesperiode: false,
  });
};

export const createToOmsorgspersonerVurdering = (requestBody: NyVurderingsversjon) => {
  const nyVurderingId = mockedToOmsorgspersonerVurderingsoversikt.vurderingselementer.length + 11;
  const { type, perioder, resultat, tekst } = requestBody;

  mockedToOmsorgspersonerVurderingsoversikt.vurderingselementer.push({
    id: `${nyVurderingId}`,
    periode: perioder[0],
    resultat,
    gjelderForSøker: true,
    gjelderForAnnenPart: false,
    links: createMockedVurderingselementLinks(nyVurderingId),
    endretIDenneBehandlingen: true,
    erInnleggelsesperiode: false,
  });
  mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder = [];
  toOmsorgspersonerVurderingerMock.push({
    id: `${nyVurderingId}`,
    type,
    versjoner: [
      {
        perioder,
        resultat,
        dokumenter: mockedDokumentliste,
        tekst,
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
    erInnleggelsesperiode: false,
  });
};

export const createLivetsSluttfaseVurdering = (requestBody: NyVurderingsversjon) => {
  const nyVurderingId = livetsSluttfaseVurderingsoversiktMock.vurderingselementer.length + 1;
  const { type, perioder, resultat, tekst } = requestBody;

  livetsSluttfaseVurderingsoversiktMock.vurderingselementer.push({
    id: `${nyVurderingId}`,
    periode: perioder[0],
    resultat,
    gjelderForSøker: true,
    gjelderForAnnenPart: false,
    links: createMockedVurderingselementLinks(nyVurderingId),
    endretIDenneBehandlingen: true,
  });
  livetsSluttfaseVurderingsoversiktMock.resterendeVurderingsperioder = [];
  livetsSluttfaseVurderingerMock.push({
    id: `${nyVurderingId}`,
    type,
    versjoner: [
      {
        perioder,
        resultat,
        dokumenter: mockedDokumentliste,
        tekst,
        endretAv: 'Z199493',
        endretTidspunkt: '2021-10-20T13:23:44.995',
      },
    ],
    annenInformasjon: {
      resterendeVurderingsperioder: [],
      perioderSomKanVurderes: [],
    },
  });
};
