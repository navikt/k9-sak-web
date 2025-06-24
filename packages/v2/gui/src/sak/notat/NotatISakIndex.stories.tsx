import type { EndreResponse, NotatDto, OpprettResponse, SkjulResponse } from '@k9-sak-web/backend/k9sak/generated';
import { BehandlingDtoSakstype, OpprettNotatDtoNotatGjelderType } from '@k9-sak-web/backend/k9sak/generated';
import { HttpResponse, delay, http, type PathParams } from 'msw';
import NotatISakIndex from './NotaterIndex';

export default {
  title: 'gui/sak/notat',
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
      }}
      sakstype={BehandlingDtoSakstype.PLEIEPENGER_SYKT_BARN}
    />
  </div>
);

const notater: NotatDto[] = [
  {
    notatTekst: 'Saken er tidligere rettet opp i punsj på grunn av manglende funksjonalitet.',
    gjelderType: OpprettNotatDtoNotatGjelderType.FAGSAK,
    versjon: 1,
    opprettetAv: 'Saksbehandler Huldra',
    opprettetTidspunkt: new Date().toISOString(),
    endretAv: '',
    endretTidspunkt: undefined,
    skjult: false,
    kanRedigere: true,
    notatId: '1',
  },
  {
    notatTekst:
      // eslint-disable-next-line max-len
      'Bruker venter på legeerklæring fra sykehus, men har fått beskjed om at sykehuslege er på ferie og det kan derfor ta litt tid før den kommer inn. Setter derfor fristen lenger frem i tid enn normalt.',
    gjelderType: OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE,
    versjon: 1,
    opprettetAv: 'saksbeh',
    opprettetTidspunkt: new Date().toISOString(),
    endretAv: '',
    endretTidspunkt: undefined,
    skjult: false,
    kanRedigere: true,
    notatId: '2',
  },
];

type LeggTilNotatRequestBody = {
  notatTekst: string;
  notatGjelderType: OpprettNotatDtoNotatGjelderType;
  fagsakId: number;
};

type EndreNotatRequestBody = {
  notatTekst: string;
  notatId: string;
  saksnummer: string;
  versjon: number;
};

type SkjulNotatRequestBody = {
  notatId: string;
  saksnummer: string;
  versjon: number;
  skjul: boolean;
};

VisNotatISakPanel.parameters = {
  msw: {
    handlers: [
      http.get('/k9/sak/api/notat', async () => {
        await delay(250);
        return HttpResponse.json(notater, { status: 200 });
      }),
      http.post<PathParams<string>, LeggTilNotatRequestBody, OpprettResponse>(
        '/k9/sak/api/notat',
        async ({ request }) => {
          const nyttNotatRequest = await request.json();
          const nyttNotat = {
            endretAv: '',
            endretTidspunkt: undefined,
            gjelderType: nyttNotatRequest.notatGjelderType,
            kanRedigere: true,
            notatId: `${notater.length + 1}`,
            notatTekst: nyttNotatRequest.notatTekst,
            opprettetAv: 'Saksbehandler',
            opprettetTidspunkt: new Date().toISOString(),
            skjult: false,
            versjon: 1,
          };
          notater.push(nyttNotat);

          return HttpResponse.json(nyttNotat, { status: 201 });
        },
      ),
      http.post<PathParams<string>, EndreNotatRequestBody, EndreResponse>(
        '/k9/sak/api/notat/endre',
        async ({ request }) => {
          const endretNotatRequest = await request.json();
          const redigertNotatIndex = notater.findIndex(notat => notat.notatId === endretNotatRequest.notatId);
          const endretNotat = {
            ...notater[redigertNotatIndex],
            skjult: !!notater[redigertNotatIndex]?.skjult,
            kanRedigere: true,
            notatTekst: endretNotatRequest.notatTekst,
            versjon: endretNotatRequest.versjon + 1,
            endretTidspunkt: new Date().toDateString(),
          };

          notater[redigertNotatIndex] = endretNotat;

          return HttpResponse.json(endretNotat, { status: 201 });
        },
      ),
      http.post<PathParams<string>, SkjulNotatRequestBody, SkjulResponse>(
        '/k9/sak/api/notat/skjul',
        async ({ request }) => {
          const skjulNotatRequest = await request.json();
          const notatIndex = notater.findIndex(notat => notat.notatId === skjulNotatRequest.notatId);
          const notat = {
            ...notater[notatIndex],
            skjult: skjulNotatRequest.skjul,
            kanRedigere: true,
            notatTekst: notater[notatIndex]?.notatTekst ?? '',
            versjon: skjulNotatRequest.versjon + 1,
            endretTidspunkt: new Date().toDateString(),
          };
          notater[notatIndex] = notat;
          return HttpResponse.json(notat, { status: 201 });
        },
      ),
    ],
  },
  screenshot: {
    mask: '.navds-chat__top-text',
  },
};
