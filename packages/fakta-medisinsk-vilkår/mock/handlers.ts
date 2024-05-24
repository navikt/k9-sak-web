/* eslint-disable import/prefer-default-export */
import { Period } from '@fpsak-frontend/utils';
import { http, HttpResponse } from 'msw';
import Dokument, { Dokumenttype } from '../src/types/Dokument';
import NyVurderingsversjon from '../src/types/NyVurderingsversjon';
import Vurderingstype from '../src/types/Vurderingstype';
import { createKontinuerligTilsynVurdering, createToOmsorgspersonerVurdering } from './apiUtils';
import createMockedVurderingselementLinks from './mocked-data/createMockedVurderingselementLinks';
import createStrukturertDokument from './mocked-data/createStrukturertDokument';
import mockedDiagnosekoderesponse from './mocked-data/mockedDiagnosekodeResponse';
import mockedDokumentliste from './mocked-data/mockedDokumentliste';
import mockedDokumentoversikt from './mocked-data/mockedDokumentoversikt';
import mockedInnleggelsesperioder from './mocked-data/mockedInnleggelsesperioder';
import mockedNyeDokumenterList from './mocked-data/mockedNyeDokumenter';
import mockedTilsynsbehovVurderinger from './mocked-data/mockedTilsynsbehovVurderinger';
import mockedTilsynsbehovVurderingsoversikt from './mocked-data/mockedTilsynsbehovVurderingsoversikt';
import mockedToOmsorgspersonerVurderinger from './mocked-data/mockedToOmsorgspersonerVurderinger';
import mockedToOmsorgspersonerVurderingsoversikt from './mocked-data/mockedToOmsorgspersonerVurderingsoversikt';

let mockedNyeDokumenter = [...mockedNyeDokumenterList];

type EndreVurderingRequestBody = NyVurderingsversjon & {
  endretAv: string;
  endretTidspunkt: string;
};

type EndreDiagnosekoderRequestBody = {
  diagnosekoder: string[];
};

type EndreInnleggelsesperioderRequestBody = {
  dryRun: boolean;
  perioder: Period[];
};

export const handlers = [
  http.get('/mock/status', () => {
    const harUklassifiserteDokumenter = mockedDokumentoversikt.dokumenter.some(
      ({ type }) => type === Dokumenttype.UKLASSIFISERT,
    );
    const manglerDiagnosekode =
      !mockedDiagnosekoderesponse ||
      !mockedDiagnosekoderesponse.diagnosekoder ||
      mockedDiagnosekoderesponse.diagnosekoder.length === 0;
    const manglerGodkjentLegeerklæring =
      mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING) === false;
    const manglerVurderingAvKontinuerligTilsynOgPleie =
      mockedTilsynsbehovVurderingsoversikt.resterendeVurderingsperioder.length > 0;
    const manglerVurderingAvToOmsorgspersoner =
      mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder.length > 0;
    const nyttDokumentHarIkkekontrollertEksisterendeVurderinger = mockedNyeDokumenter.length > 0;
    const harDataSomIkkeHarBlittTattMedIBehandling = true;

    return HttpResponse.json(
      {
        kanLøseAksjonspunkt:
          !harUklassifiserteDokumenter &&
          !manglerDiagnosekode &&
          !manglerGodkjentLegeerklæring &&
          !manglerVurderingAvKontinuerligTilsynOgPleie &&
          !manglerVurderingAvToOmsorgspersoner &&
          !nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
        harUklassifiserteDokumenter,
        manglerDiagnosekode,
        manglerGodkjentLegeerklæring,
        manglerVurderingAvKontinuerligTilsynOgPleie,
        manglerVurderingAvToOmsorgspersoner,
        harDataSomIkkeHarBlittTattMedIBehandling,
        nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
      },
      { status: 200 },
    );
  }),

  http.get('/mock/vurdering', ({ request }) => {
    const url = new URL(request.url);
    const vurderingId = url.searchParams.get('sykdomVurderingId');
    const alleVurderinger = [...mockedTilsynsbehovVurderinger, ...mockedToOmsorgspersonerVurderinger];
    const vurdering = alleVurderinger.find(({ id }) => id === vurderingId);
    return HttpResponse.json(vurdering, { status: 200 });
  }),

  http.post<undefined, NyVurderingsversjon>('/mock/opprett-vurdering', async ({ request }) => {
    const body = await request.json();
    if (body.dryRun === true) {
      return HttpResponse.json(
        {
          perioderMedEndringer: [
            {
              periode: {
                fom: '2024-01-01',
                tom: '2024-01-10',
              },
              endrerVurderingSammeBehandling: true,
              endrerAnnenVurdering: false,
            },
          ],
        },
        { status: 200 },
      );
    }
    if (body.type === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
      createKontinuerligTilsynVurdering(body);
    } else {
      createToOmsorgspersonerVurdering(body);
    }
    return HttpResponse.json(null, { status: 201 });
  }),

  http.post<undefined, EndreVurderingRequestBody>('/mock/endre-vurdering', async ({ request }) => {
    const body = await request.json();
    if (body.dryRun === true) {
      return HttpResponse.json(
        {
          perioderMedEndringer: [
            {
              periode: {
                fom: '2024-01-01',
                tom: '2024-01-10',
              },
              endrerVurderingSammeBehandling: true,
              endrerAnnenVurdering: false,
            },
          ],
        },
        { status: 201 },
      );
    }
    const { id } = body;
    const { perioder } = body;
    mockedTilsynsbehovVurderingsoversikt.vurderingselementer =
      mockedTilsynsbehovVurderingsoversikt.vurderingselementer.filter(element => id !== element.id);
    perioder.forEach(periode => {
      mockedTilsynsbehovVurderingsoversikt.vurderingselementer.unshift({
        id,
        periode,
        resultat: body.resultat,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
        links: createMockedVurderingselementLinks(id),
        endretIDenneBehandlingen: true,
        erInnleggelsesperiode: false,
      });
    });

    const index = mockedTilsynsbehovVurderinger.findIndex(element => element.id === id);
    if (mockedTilsynsbehovVurderinger[index]) {
      mockedTilsynsbehovVurderinger[index].versjoner.unshift({
        perioder,
        resultat: body.resultat,
        dokumenter: mockedDokumentliste,
        tekst: body.tekst,
        endretAv: body.endretAv,
        endretTidspunkt: body.endretTidspunkt,
      });
    }
    return HttpResponse.json(null, { status: 201 });
  }),

  http.get('/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt', () => {
    const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    return HttpResponse.json(
      {
        ...mockedTilsynsbehovVurderingsoversikt,
        harGyldigSignatur,
        resterendeVurderingsperioder: !harGyldigSignatur
          ? []
          : mockedTilsynsbehovVurderingsoversikt.resterendeVurderingsperioder,
      },
      { status: 200 },
    );
  }),

  http.get('/mock/to-omsorgspersoner/vurderingsoversikt', () => {
    const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    return HttpResponse.json(
      {
        ...mockedToOmsorgspersonerVurderingsoversikt,
        harGyldigSignatur,
        resterendeVurderingsperioder: !harGyldigSignatur
          ? []
          : mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder,
      },
      { status: 200 },
    );
  }),

  http.get('/mock/dokumentoversikt', () => HttpResponse.json(mockedDokumentoversikt, { status: 200 })),

  http.post<undefined, Dokument>('/mock/endre-dokument', async ({ request }) => {
    const body = await request.json();
    createStrukturertDokument(body);
    return HttpResponse.json(mockedDokumentoversikt, { status: 201 });
  }),

  http.get('/mock/data-til-vurdering', () => HttpResponse.json(mockedDokumentliste, { status: 200 })),

  http.get('/mock/diagnosekoder', () => HttpResponse.json(mockedDiagnosekoderesponse, { status: 200 })),

  http.post<undefined, EndreDiagnosekoderRequestBody>('/mock/endre-diagnosekoder', async ({ request }) => {
    const body = await request.json();
    mockedDiagnosekoderesponse.diagnosekoder = body.diagnosekoder || [];
    return HttpResponse.json({}, { status: 201 });
  }),

  http.get('/mock/innleggelsesperioder', () => HttpResponse.json(mockedInnleggelsesperioder, { status: 200 })),

  http.post<undefined, EndreInnleggelsesperioderRequestBody>(
    '/mock/endre-innleggelsesperioder',
    async ({ request }) => {
      const body = await request.json();
      if (body.dryRun === true) {
        return HttpResponse.json({ førerTilRevurdering: true }, { status: 200 });
      }
      mockedInnleggelsesperioder.perioder = body.perioder || [];
      return HttpResponse.json({}, { status: 200 });
    },
  ),

  http.get('/mock/nye-dokumenter', () => HttpResponse.json(mockedNyeDokumenter, { status: 200 })),

  http.post('/mock/nye-dokumenter', () => {
    mockedNyeDokumenter = [];
    return HttpResponse.json({}, { status: 201 });
  }),

  http.get('/', () => HttpResponse.json(null, { status: 200 })),
];
