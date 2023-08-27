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
    <NotatISakIndex />
  </div>
);

VisNotatISakPanel.parameters = {
  msw: {
    handlers: [
      rest.get('/notat?fagsakId=X', (req, res, ctx) =>
        res(
          ctx.json([
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
          ]),
        ),
      ),
      rest.post('/notat', (req, res, ctx) => res(ctx.status(200))),
    ],
  },
};
