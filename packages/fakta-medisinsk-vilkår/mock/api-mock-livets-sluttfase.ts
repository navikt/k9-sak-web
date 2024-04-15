/* eslint-disable no-console */
import cors from 'cors';
import express from 'express';
import { Dokumenttype } from '../src/types/Dokument';
import { createLivetsSluttfaseVurdering } from './apiUtils';
import createMockedVurderingselementLinks from './mocked-data/createMockedVurderingselementLinks';
import createStrukturertDokument from './mocked-data/createStrukturertDokument';
import mockedDokumentliste from './mocked-data/mockedDokumentliste';
import mockedDokumentoversikt from './mocked-data/mockedDokumentoversikt';
import livetsSluttfaseVurderingerMock from './mocked-data/mockedLivetsSluttfaseVurderinger';
import livetsSluttfaseVurderingsoversiktMock from './mocked-data/mockedLivetsSluttfaseVurderingsoversikt';
import mockedNyeDokumenterList from './mocked-data/mockedNyeDokumenter';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:8081',
  }),
);

let mockedNyeDokumenter = [...mockedNyeDokumenterList];

app.use('/mock/status', (req, res) => {
  const harUklassifiserteDokumenter = mockedDokumentoversikt.dokumenter.some(
    ({ type }) => type === Dokumenttype.UKLASSIFISERT,
  );
  const manglerGodkjentLegeerklæring =
    mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING) === false;
  const manglerVurderingAvILivetsSluttfase =
    livetsSluttfaseVurderingsoversiktMock.resterendeVurderingsperioder.length > 0;
  const nyttDokumentHarIkkekontrollertEksisterendeVurderinger = mockedNyeDokumenter.length > 0;
  const harDataSomIkkeHarBlittTattMedIBehandling = true;

  res.send({
    kanLøseAksjonspunkt:
      !harUklassifiserteDokumenter &&
      !manglerGodkjentLegeerklæring &&
      !manglerVurderingAvILivetsSluttfase &&
      !nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
    harUklassifiserteDokumenter,
    manglerGodkjentLegeerklæring,
    harDataSomIkkeHarBlittTattMedIBehandling,
    nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
  });
});

app.use('/mock/vurdering', (req, res) => {
  const vurderingId = req.query.sykdomVurderingId;
  const alleVurderinger = [...livetsSluttfaseVurderingerMock];
  const vurdering = alleVurderinger.find(({ id }) => id === vurderingId);
  res.send(vurdering);
});

app.use('/mock/opprett-vurdering', (req, res) => {
  if (req.body.dryRun === true) {
    res.send({
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
    });
  } else {
    createLivetsSluttfaseVurdering(req.body);
    res.send();
  }
});

app.use('/mock/endre-vurdering', (req, res) => {
  if (req.body.dryRun === true) {
    res.send({
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
    });
  } else {
    const { id } = req.body;
    const { perioder } = req.body;
    livetsSluttfaseVurderingsoversiktMock.vurderingselementer =
      livetsSluttfaseVurderingsoversiktMock.vurderingselementer.filter(element => id !== element.id);
    perioder.forEach(periode => {
      livetsSluttfaseVurderingsoversiktMock.vurderingselementer.unshift({
        id,
        periode,
        resultat: req.body.resultat,
        gjelderForSøker: true,
        gjelderForAnnenPart: false,
        links: createMockedVurderingselementLinks(id),
        endretIDenneBehandlingen: true,
      });
    });

    const index = livetsSluttfaseVurderingerMock.findIndex(element => element.id === id);
    if (livetsSluttfaseVurderingerMock[index]) {
      livetsSluttfaseVurderingerMock[index].versjoner.unshift({
        perioder,
        resultat: req.body.resultat,
        dokumenter: mockedDokumentliste,
        tekst: req.body.tekst,
        endretAv: req.body.endretAv,
        endretTidspunkt: req.body.endretTidspunkt,
      });
    }
    res.send();
  }
});

app.use('/mock/livets-sluttfase/vurderingsoversikt', (req, res) => {
  const harGyldigSignatur = mockedDokumentoversikt.dokumenter.some(({ type }) => type === Dokumenttype.LEGEERKLÆRING);
  res.send({
    ...livetsSluttfaseVurderingsoversiktMock,
    harGyldigSignatur,
    resterendeVurderingsperioder: !harGyldigSignatur
      ? []
      : livetsSluttfaseVurderingsoversiktMock.resterendeVurderingsperioder,
  });
});

app.use('/mock/dokumentoversikt', (req, res) => {
  res.send(mockedDokumentoversikt);
});

app.use('/mock/endre-dokument', (req, res) => {
  createStrukturertDokument(req.body);
  res.send(mockedDokumentoversikt);
});

app.use('/mock/data-til-vurdering', (req, res) => {
  res.send(mockedDokumentliste);
});

app.get('/mock/nye-dokumenter', (req, res) => {
  res.send(mockedNyeDokumenter);
});

app.post('/mock/nye-dokumenter', (req, res) => {
  mockedNyeDokumenter = [];
  res.send({});
});

app.get('/', (req, res) => {
  res.status(200).send('ok');
});

const port = 8082;
app.listen(port, () => {
  console.log('API-mock listening on port', port);
});
