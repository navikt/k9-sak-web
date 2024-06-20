import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import NotatISakIndex from './NotaterIndex';

export default {
  title: 'sak/sak-notat',
  component: NotatISakIndex,
};

export const VisNotatISakPanel = () => (
  <div
    style={{
      width: '700px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <NotatISakIndex
      fagsakId="1"
      fagsakHarPleietrengende
      navAnsatt={{
        brukernavn: 'saksbeh',
        funksjonellTid: '2023-08-28T16:11:44.107219587',
        kanBehandleKode6: false,
        kanBehandleKode7: false,
        kanBehandleKodeEgenAnsatt: false,
        kanBeslutte: false,
        kanOverstyre: false,
        kanSaksbehandle: true,
        kanVeilede: false,
        navn: 'Sara Saksbehandler',
      }}
    />
  </div>
);

const notater = [
  {
    id: 1,
    notatTekst: 'Saken er tidligere rettet opp i punsj på grunn av manglende funksjonalitet.',
    gjelderType: { navn: 'FAGSAK' },
    versjon: 1,
    opprettetAv: 'Saksbehandler Huldra',
    opprettetTidspunkt: new Date(),
    endretAv: undefined,
    endretTidspunkt: undefined,
    fagsakId: '1',
    skjult: false,
    kanRedigere: true,
  },
  {
    id: 2,
    notatTekst:
      // eslint-disable-next-line max-len
      'Bruker venter på legeerklæring fra sykehus, men har fått beskjed om at sykehuslege er på ferie og det kan derfor ta litt tid før den kommer inn. Setter derfor fristen lenger frem i tid enn normalt.',
    gjelderType: { navn: 'PLEIETRENGENDE' },
    versjon: 1,
    opprettetAv: 'saksbeh',
    opprettetTidspunkt: new Date(),
    endretAv: undefined,
    endretTidspunkt: undefined,
    fagsakId: undefined,
    aktørId: '123',
    sakstype: 'PSB',
    skjult: false,
    kanRedigere: true,
  },
];

type LeggTilNotatRequestBody = {
  id: number;
  notatTekst: string;
  endretAv: string;
  notatGjelderType: { navn: string };
  fagsakId: number;
  opprettetAv: string;
};

VisNotatISakPanel.parameters = {
  msw: {
    handlers: [
      http.get('/k9/sak/api/notat', async () => {
        await delay(250);
        return HttpResponse.json(notater, { status: 200 });
      }),
      http.post<undefined, LeggTilNotatRequestBody>('/k9/sak/api/notat', async ({ request }) => {
        const nyttNotat = await request.json();
        const redigertNotatIndex = notater.findIndex(notat => notat.id === nyttNotat.id);
        if (redigertNotatIndex >= 0) {
          notater[redigertNotatIndex] = {
            ...notater[redigertNotatIndex],
            notatTekst: nyttNotat.notatTekst,
            versjon: notater[redigertNotatIndex].versjon + 1,
            endretTidspunkt: new Date(),
            endretAv: nyttNotat.endretAv,
          };
        } else {
          notater.push({
            id: notater.length + 1,
            notatTekst: nyttNotat.notatTekst,
            gjelderType: nyttNotat.notatGjelderType,
            fagsakId: nyttNotat.fagsakId,
            opprettetAv: nyttNotat.opprettetAv,
            opprettetTidspunkt: new Date(),
            endretAv: '',
            endretTidspunkt: undefined,
            aktørId: '123',
            sakstype: 'PSB',
            versjon: 1,
            skjult: false,
            kanRedigere: true,
          });
        }
        return new HttpResponse('done', { status: 201 });
      }),
    ],
  },
  screenshot: {
    mask: '.navds-chat__top-text',
  },
};
