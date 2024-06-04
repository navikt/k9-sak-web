import { http, HttpResponse } from 'msw';

import utenlandsopphold from './mockdata/utenlandsoppholdMock';
// eslint-disable-next-line import/prefer-default-export
export const testHandlers = {
  navAnsatt: http.get('/k9/sak/api/nav-ansatt', () =>
    HttpResponse.json({
      brukernavn: 'bobbyb',
      funksjonellTid: '2022-01-13T12:38:04.7280555',
      kanBehandleKode6: false,
      kanBehandleKode7: false,
      kanBehandleKodeEgenAnsatt: false,
      kanBeslutte: true,
      kanOverstyre: false,
      kanSaksbehandle: true,
      kanVeilede: false,
      navn: 'Bobby Binders',
      skalViseDetaljerteFeilmeldinger: true,
    }),
  ),
  utenlandsopphold: http.get('/k9/sak/api/behandling/uttak/utenlandsopphold', () =>
    HttpResponse.json(utenlandsopphold),
  ),
};
