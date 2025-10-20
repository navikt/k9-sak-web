import NyVurderingsversjon from '../src/types/NyVurderingsversjon';
import createMockedVurderingselementLinks from './mocked-data/createMockedVurderingselementLinks';
import mockedDokumentliste from './mocked-data/mockedDokumentliste';
import tilsynsbehovVurderingerMock from './mocked-data/mockedTilsynsbehovVurderinger';
import tilsynsbehovVurderingsoversiktMock from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import toOmsorgspersonerVurderingerMock from './mocked-data/mockedToOmsorgspersonerVurderinger';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';

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
