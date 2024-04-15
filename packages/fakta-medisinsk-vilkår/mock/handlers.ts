/* eslint-disable import/prefer-default-export */
import { rest } from 'msw';
import { Dokumenttype } from '../src/types/Dokument';
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

export const handlers = [
  rest.get('http://localhost:8082/mock/status', (req, res, ctx) => {
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

    return res(
      ctx.status(200),
      ctx.json({
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
      }),
    );
  }),

  rest.get('http://localhost:8082/mock/vurdering', (req, res, ctx) => {
    const vurderingId = req.url.searchParams.get('sykdomVurderingId');
    const alleVurderinger = [...mockedTilsynsbehovVurderinger, ...mockedToOmsorgspersonerVurderinger];
    const vurdering = alleVurderinger.find(({ id }) => id === vurderingId);
    return res(ctx.status(200), ctx.json(vurdering));
  }),

  rest.post('http://localhost:8082/mock/opprett-vurdering', async (req, res, ctx) => {
    const body = await req.json();
    if (body.dryRun === true) {
      return res(
        ctx.status(200),
        ctx.json({
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
        }),
      );
    }
    if (body.type === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
      createKontinuerligTilsynVurdering(body);
    } else {
      createToOmsorgspersonerVurdering(body);
    }
    return res(ctx.status(201));
  }),

  rest.post('http://localhost:8082/mock/endre-vurdering', async (req, res, ctx) => {
    const body = await req.json();
    if (body.dryRun === true) {
      return res(
        ctx.status(201),
        ctx.json({
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
        }),
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
    return res(ctx.status(201));
  }),

  rest.get('http://localhost:8082/mock/kontinuerlig-tilsyn-og-pleie/vurderingsoversikt', (req, res, ctx) => {
    const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    return res(
      ctx.status(200),
      ctx.json({
        ...mockedTilsynsbehovVurderingsoversikt,
        harGyldigSignatur,
        resterendeVurderingsperioder: !harGyldigSignatur
          ? []
          : mockedTilsynsbehovVurderingsoversikt.resterendeVurderingsperioder,
      }),
    );
  }),

  rest.get('http://localhost:8082/mock/to-omsorgspersoner/vurderingsoversikt', (req, res, ctx) => {
    const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
    return res(
      ctx.status(200),
      ctx.json({
        ...mockedToOmsorgspersonerVurderingsoversikt,
        harGyldigSignatur,
        resterendeVurderingsperioder: !harGyldigSignatur
          ? []
          : mockedToOmsorgspersonerVurderingsoversikt.resterendeVurderingsperioder,
      }),
    );
  }),

  rest.get('http://localhost:8082/mock/dokumentoversikt', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedDokumentoversikt)),
  ),

  rest.post('http://localhost:8082/mock/endre-dokument', async (req, res, ctx) => {
    const body = await req.json();
    createStrukturertDokument(body);
    return res(ctx.status(201), ctx.json(mockedDokumentoversikt));
  }),

  rest.get('http://localhost:8082/mock/data-til-vurdering', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedDokumentliste)),
  ),

  rest.get('http://localhost:8082/mock/diagnosekoder', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedDiagnosekoderesponse)),
  ),

  rest.post('http://localhost:8082/mock/endre-diagnosekoder', async (req, res, ctx) => {
    const body = await req.json();
    mockedDiagnosekoderesponse.diagnosekoder = body.diagnosekoder || [];
    return res(ctx.status(201), ctx.json({}));
  }),

  rest.get('http://localhost:8082/mock/innleggelsesperioder', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedInnleggelsesperioder)),
  ),

  rest.post('http://localhost:8082/mock/endre-innleggelsesperioder', async (req, res, ctx) => {
    const body = await req.json();
    if (body.dryRun === true) {
      return res(ctx.status(200), ctx.json({ førerTilRevurdering: true }));
    }
    mockedInnleggelsesperioder.perioder = body.perioder || [];
    return res(ctx.status(200), ctx.json({}));
  }),

  rest.get('http://localhost:8082/mock/nye-dokumenter', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(mockedNyeDokumenter)),
  ),

  rest.post('http://localhost:8082/mock/nye-dokumenter', (req, res, ctx) => {
    mockedNyeDokumenter = [];
    return res(ctx.status(201), ctx.json({}));
  }),

  rest.get('/', (req, res, ctx) => res(ctx.status(200))),
];
