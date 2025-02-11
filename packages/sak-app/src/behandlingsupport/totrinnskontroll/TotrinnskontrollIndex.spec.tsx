import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import TotrinnskontrollIndex from './TotrinnskontrollIndex';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as Record<string, unknown>;
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
    sakstype: fagsakYtelsesType.FORELDREPENGER,
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
    requestApi.mock(K9sakApiKeys.KODEVERK, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, kodeverk);
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, kodeverk);
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(K9sakApiKeys.TOTRINNS_KLAGE_VURDERING, {});
    requestApi.mock(K9sakApiKeys.SAVE_TOTRINNSAKSJONSPUNKT);
    requestApi.mock(K9sakApiKeys.TILGJENGELIGE_VEDTAKSBREV, {});
    requestApi.mock(K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {});

    const totrinnskontrollAksjonspunkter = [];
    requestApi.mock(K9sakApiKeys.TOTRINNSAKSJONSPUNKT_ARSAKER, totrinnskontrollAksjonspunkter);

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
