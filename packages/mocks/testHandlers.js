import { rest } from 'msw';
// eslint-disable-next-line import/prefer-default-export
export const testHandlers = {
  navAnsatt: rest.get('/k9/sak/api/nav-ansatt', (req, res, ctx) =>
    res(
      ctx.json({
        brukernavn: 'beslut',
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
  ),
};
