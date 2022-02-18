import { rest } from 'msw';
// eslint-disable-next-line import/prefer-default-export
export const testHandlers = {
  navAnsatt: rest.get('/k9/sak/api/nav-ansatt', (req, res, ctx) =>
    res(
      ctx.json({
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
  ),
  utenlandsopphold: rest.get('/k9/sak/api/nav-ansatt', (req, res, ctx) =>
    res(
      ctx.json({
        perioder: [
          {
            periode: '2021-12-20/2022-03-20',
            landkode: {
              kode: 'FIN',
              navn: 'FIN',
              kodeverk: 'LANDKODER',
            },
            årsak: {
              kode: 'BARNET_INNLAGT_I_HELSEINSTITUSJON_FOR_NORSK_OFFENTLIG_REGNING',
              navn: 'Barnet er innlagt i helseinstitusjon for norsk offentlig regning (mottar pleiepenger som i Norge, telles ikke i 8 uker)',
            },
          },
        ],
      }),
    ),
  ),
};
