import {
  OpprettNotatDtoNotatGjelderType,
  type OpprettNotatDtoNotatGjelderType as NotatGjelderType,
} from '@k9-sak-web/backend/k9sak/generated';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { HttpResponse, delay, http } from 'msw';
import NotatISakIndex from './NotaterIndex';
import type { NotatResponse } from './types/NotatResponse';

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
    />
  </div>
);

const notater: NotatResponse[] = [
  {
    notatTekst: 'Saken er tidligere rettet opp i punsj på grunn av manglende funksjonalitet.',
    gjelderType: { navn: 'FAGSAK', kode: OpprettNotatDtoNotatGjelderType.FAGSAK },
    versjon: 1,
    opprettetAv: 'Saksbehandler Huldra',
    opprettetTidspunkt: new Date().toISOString(),
    endretAv: '',
    endretTidspunkt: null,
    skjult: false,
    kanRedigere: true,
    notatId: 1,
  },
  {
    notatTekst:
      // eslint-disable-next-line max-len
      'Bruker venter på legeerklæring fra sykehus, men har fått beskjed om at sykehuslege er på ferie og det kan derfor ta litt tid før den kommer inn. Setter derfor fristen lenger frem i tid enn normalt.',
    gjelderType: { navn: 'PLEIETRENGENDE', kode: OpprettNotatDtoNotatGjelderType.PLEIETRENGENDE },
    versjon: 1,
    opprettetAv: 'saksbeh',
    opprettetTidspunkt: new Date().toISOString(),
    endretAv: '',
    endretTidspunkt: null,
    sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    skjult: false,
    kanRedigere: true,
    notatId: 2,
  },
];

type LeggTilNotatRequestBody = {
  id: number;
  notatTekst: string;
  endretAv: string;
  notatGjelderType: { navn: string; kode: NotatGjelderType };
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
      http.post<object, LeggTilNotatRequestBody>('/k9/sak/api/notat', async ({ request }) => {
        const nyttNotat = await request.json();
        const redigertNotatIndex = notater.findIndex(notat => notat.notatId === nyttNotat.id);
        if (redigertNotatIndex >= 0) {
          notater[redigertNotatIndex] = {
            ...notater[redigertNotatIndex],
            notatId: notater[redigertNotatIndex]?.notatId || nyttNotat.id,
            opprettetAv: notater[redigertNotatIndex]?.opprettetAv || nyttNotat.opprettetAv,
            opprettetTidspunkt: notater[redigertNotatIndex]?.opprettetTidspunkt || new Date().toISOString(),
            skjult: notater[redigertNotatIndex]?.skjult || false,
            kanRedigere: notater[redigertNotatIndex]?.kanRedigere || true,
            notatTekst: nyttNotat.notatTekst,
            versjon: notater[redigertNotatIndex] ? notater[redigertNotatIndex].versjon + 1 : 0,
            endretTidspunkt: new Date(),
            endretAv: nyttNotat.endretAv,
          };
        } else {
          notater.push({
            notatId: notater.length + 1,
            notatTekst: nyttNotat.notatTekst,
            gjelderType: nyttNotat.notatGjelderType,
            opprettetAv: nyttNotat.opprettetAv,
            opprettetTidspunkt: new Date().toISOString(),
            endretAv: '',
            endretTidspunkt: null,
            sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
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
