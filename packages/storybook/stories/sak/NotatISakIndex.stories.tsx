import dayjs from 'dayjs';
import { rest } from 'msw';
import React from 'react';
import NotatISakIndex from '@k9-sak-web/sak-notat';

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
    <NotatISakIndex fagsakId={1} />
  </div>
);

let notater = [
  {
    id: 1,
    notatTekst: 'Saken er tidligere rettet opp i punsj på grunn av manglende funksjonalitet.',
    gjelderType: 'FAGSAK',
    versjon: 1,
    opprettetAv: 'Saksbehandler Huldra',
    opprettetTidspunkt: '01.01.22 14:00',
    endretAv: '',
    endretTidspunkt: undefined,
    fagsakId: '1',
  },
  {
    id: 2,
    notatTekst:
      // eslint-disable-next-line max-len
      'Bruker venter på legeerklæring fra sykehus, men har fått beskjed om at sykehuslege er på ferie og det kan derfor ta litt tid før den kommer inn. Setter derfor fristen lenger frem i tid enn normalt.',
    gjelderType: 'PLEIETRENGENDE',
    versjon: 1,
    opprettetAv: 'Saksbehandler Huldra',
    opprettetTidspunkt: '01.01.22 14:00',
    endretAv: '',
    endretTidspunkt: undefined,
    fagsakId: undefined,
    aktørId: '123',
    sakstype: 'PSB',
  },
];

VisNotatISakPanel.parameters = {
  msw: {
    handlers: [
      rest.get('/notat', (req, res, ctx) => res(ctx.delay(250), ctx.json(notater))),
      rest.post('/notat', async (req, res, ctx) => {
        const nyttNotat = await req.json();
        const redigertNotat = nyttNotat.id && notater.find(notat => notat.id === nyttNotat.id);
        if (redigertNotat) {
          notater = notater.filter(notat => notat.id !== nyttNotat.id);
          notater.push({
            ...redigertNotat,
            notatTekst: nyttNotat.notatTekst,
            versjon: redigertNotat.versjon + 1,
            endretTidspunkt: dayjs().format('DD.MM.YYYY HH:mm'),
            endretAv: 'Deg',
          });
          notater = notater.sort((a, b) => a.id - b.id);
        } else {
          notater.push({
            id: notater.length + 1,
            notatTekst: nyttNotat.notatTekst,
            gjelderType: nyttNotat.notatGjelderType,
            fagsakId: nyttNotat.fagsakId,
            opprettetAv: 'Deg',
            opprettetTidspunkt: dayjs().format('DD.MM.YYYY HH:mm'),
            endretAv: '',
            endretTidspunkt: undefined,
            aktørId: '123',
            sakstype: 'PSB',
            versjon: 1,
          });
        }
        return res(ctx.status(201));
      }),
    ],
  },
};
