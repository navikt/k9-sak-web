import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
import TotrinnskontrollIndex from './TotrinnskontrollIndex';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
  return {
    ...actual,
    useHistory: () => ({
      push: vi.fn(),
    }),
    useLocation: () => ({
      pathname: 'test',
      search: 'test',
      state: {},
      hash: 'test',
    }),
  };
});

describe('<TotrinnskontrollIndex>', () => {
  const fagsak = {
    saksnummer: '1',
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: '',
    },
    person: {
      aktørId: '123',
    },
  };

  const alleBehandlinger = [
    {
      id: 1234,
      versjon: 123,
      type: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
        kodeverk: '',
      },
      opprettet: '‎29.08.‎2017‎ ‎09‎:‎54‎:‎22',
      status: {
        kode: 'FVED',
        kodeverk: 'BEHANDLING_STATUS',
      },
      toTrinnsBehandling: true,
      ansvarligSaksbehandler: 'Espen Utvikler',
      behandlingÅrsaker: [],
    },
  ];

  const kodeverk = {
    [kodeverkTyper.SKJERMLENKE_TYPE]: [],
  };

  const navAnsatt = {
    brukernavn: 'Test',
    kanBehandleKode6: false,
    kanBehandleKode7: false,
    kanBehandleKodeEgenAnsatt: false,
    kanBeslutte: true,
    kanOverstyre: false,
    kanSaksbehandle: true,
    kanVeilede: false,
    navn: 'Test',
  };

  it('skal vise modal når beslutter godkjenner', async () => {
    requestApi.mock(UngSakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(UngSakApiKeys.KODEVERK_TILBAKE, kodeverk);
    requestApi.mock(UngSakApiKeys.KODEVERK_KLAGE, kodeverk);
    requestApi.mock(UngSakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(UngSakApiKeys.TOTRINNS_KLAGE_VURDERING, {});
    requestApi.mock(UngSakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);
    requestApi.mock(UngSakApiKeys.TILGJENGELIGE_VEDTAKSBREV, {});
    requestApi.mock(UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {});

    const totrinnskontrollAksjonspunkter = [];
    requestApi.mock(UngSakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER, totrinnskontrollAksjonspunkter);

    renderWithIntlAndReduxForm(
      <TotrinnskontrollIndex
        fagsak={fagsak as Fagsak}
        alleBehandlinger={alleBehandlinger as BehandlingAppKontekst[]}
        behandlingId={alleBehandlinger[0].id}
        behandlingVersjon={alleBehandlinger[0].versjon}
      />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Godkjenn vedtaket' }));
    });
    expect(
      screen.getByRole('dialog', {
        name: 'Omsorgspenger er innvilget og vedtaket blir iverksatt. Du kommer nå til forsiden.',
      }),
    ).toBeInTheDocument();
  });
});
