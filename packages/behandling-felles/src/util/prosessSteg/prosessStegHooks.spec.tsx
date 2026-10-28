/* eslint-disable class-methods-use-this */
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { renderHook } from '@testing-library/react';
import { BehandlingProvider } from '@k9-sak-web/gui/context/BehandlingContext.js';
import { ProsessStegDef, ProsessStegPanelDef } from './ProsessStegDef';
import { ProsessStegPanelUtledet, ProsessStegUtledet } from './ProsessStegUtledet';
import prosessStegHooks from './prosessStegHooks';

const medBehandlingProvider = ({ children }) => (
  <BehandlingProvider
    refetchBehandling={() => Promise.resolve()}
    settBehandling={vi.fn()}
    oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
  >
    {children}
  </BehandlingProvider>
);

describe('<prosessStegHooks>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.FORELDREPENGER, // FAGSAK_YTELSE
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
  } as Fagsak;

  const behandling = {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'test' },
    type: { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'test' },
    behandlingPåVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
  };

  const aksjonspunkter = [
    {
      definisjon: { kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU, kodeverk: 'BEHANDLING_DEF' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'BEHANDLING_STATUS' },
      kanLoses: true,
      erAktivt: true,
    },
  ];

  const vilkar = [
    {
      vilkarType: { kode: vilkarType.SOKERSOPPLYSNINGSPLIKT, kodeverk: 'test' },
      overstyrbar: false,
      perioder: [
        {
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          merknadParametere: {
            antattGodkjentArbeid: 'P0D',
            antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
          },
          periode: { fom: '2020-03-16', tom: '2020-03-19' },
        },
      ],
    },
  ];

  const kanOverstyreAccess = { isEnabled: false, employeeHasAccess: false };

  class PanelDef extends ProsessStegPanelDef {
    getKomponent = props => <div {...props} />;

    getAksjonspunktKoder = () => [aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU];

    getAksjonspunktTekstkoder = () => ['SokersOpplysningspliktForm.UtfyllendeOpplysninger'];

    getVilkarKoder = () => [vilkarType.SOKERSOPPLYSNINGSPLIKT];

    getData = ({ soknad }) => ({
      soknad,
    });
  }

  const panelDef = new PanelDef();

  class OpplysningspliktProsessStegPanelDef extends ProsessStegDef {
    getUrlKode = () => prosessStegCodes.OPPLYSNINGSPLIKT;

    getTekstKode = () => 'Behandlingspunkt.Opplysningsplikt';

    getPanelDefinisjoner = () => [panelDef];
  }

  it('skal utlede prosesstegpaneler, valgt panel og paneler formatert for meny', () => {
    const ekstraPanelData = {
      soknad: 'test_soknad',
    };
    const rettigheter = {
      writeAccess: {
        isEnabled: true,
        employeeHasAccess: true,
      },
      kanOverstyreAccess: {
        isEnabled: true,
        employeeHasAccess: true,
      },
    };

    const apentFaktaPanelInfo = undefined;

    const hasFetchError = false;

    const valgtProsessSteg = 'default';

    // ACT
    const { result } = renderHook(
      () =>
        prosessStegHooks.useProsessStegPaneler(
          [new OpplysningspliktProsessStegPanelDef()],
          ekstraPanelData,
          fagsak,
          rettigheter,
          behandling as Behandling,
          aksjonspunkter,
          vilkar,
          hasFetchError,
          valgtProsessSteg,
          apentFaktaPanelInfo,
        ),
      { wrapper: medBehandlingProvider },
    );

    const prosessStegPaneler = result.current[0];
    const valgtPanel = result.current[1];
    const formaterteProsessStegPaneler = result.current[2];

    expect(prosessStegPaneler).toHaveLength(1);
    const panel = prosessStegPaneler[0];
    expect(valgtPanel).toEqual(panel);
    expect(formaterteProsessStegPaneler).toEqual([
      {
        isActive: true,
        isDisabled: false,
        isFinished: false,
        labelId: 'Behandlingspunkt.Opplysningsplikt',
        type: ProcessMenuStepType.warning,
        usePartialStatus: false,
      },
    ]);
  });

  it('skal ikke velge prosess-steg på nytt mens behandlingsdata er utdatert', () => {
    class UttakPanelDef extends ProsessStegPanelDef {
      getKomponent = props => <div {...props} />;

      getOverstyrVisningAvKomponent = () => true;
    }
    class UttakProsessStegDef extends ProsessStegDef {
      getUrlKode = () => prosessStegCodes.UTTAK;

      getTekstKode = () => 'Behandlingspunkt.Uttak';

      getPanelDefinisjoner = () => [new UttakPanelDef()];
    }
    const rettigheter = {
      writeAccess: { isEnabled: true, employeeHasAccess: true },
      kanOverstyreAccess: { isEnabled: false, employeeHasAccess: false },
    };
    const definisjoner = [new OpplysningspliktProsessStegPanelDef(), new UttakProsessStegDef()];

    let erBehandlingsdataUtdatert = false;
    const { result, rerender } = renderHook(
      ({ versjon, valgtProsessSteg }) =>
        prosessStegHooks.useProsessStegPaneler(
          definisjoner,
          {},
          fagsak,
          rettigheter,
          { ...behandling, versjon } as Behandling,
          aksjonspunkter,
          vilkar,
          false,
          valgtProsessSteg,
          undefined,
        ),
      {
        initialProps: { versjon: 2, valgtProsessSteg: prosessStegCodes.UTTAK },
        wrapper: ({ children }) => (
          <BehandlingProvider
            refetchBehandling={() => Promise.resolve()}
            settBehandling={vi.fn()}
            oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
            erBehandlingsdataUtdatert={erBehandlingsdataUtdatert}
          >
            {children}
          </BehandlingProvider>
        ),
      },
    );
    const uttakPanel = result.current[1];
    expect(uttakPanel?.getUrlKode()).toEqual(prosessStegCodes.UTTAK);

    erBehandlingsdataUtdatert = true;
    rerender({ versjon: 2, valgtProsessSteg: 'default' });
    expect(result.current[1]).toBe(uttakPanel);

    erBehandlingsdataUtdatert = false;
    rerender({ versjon: 3, valgtProsessSteg: 'default' });
    expect(result.current[1]?.getUrlKode()).toEqual(prosessStegCodes.OPPLYSNINGSPLIKT);
  });

  it('skal velge prosess-steg på nytt når URL endres og behandlingsdata er oppdatert', () => {
    class UttakPanelDef extends ProsessStegPanelDef {
      getKomponent = props => <div {...props} />;

      getOverstyrVisningAvKomponent = () => true;
    }
    class UttakProsessStegDef extends ProsessStegDef {
      getUrlKode = () => prosessStegCodes.UTTAK;

      getTekstKode = () => 'Behandlingspunkt.Uttak';

      getPanelDefinisjoner = () => [new UttakPanelDef()];
    }
    const rettigheter = {
      writeAccess: { isEnabled: true, employeeHasAccess: true },
      kanOverstyreAccess: { isEnabled: false, employeeHasAccess: false },
    };
    const definisjoner = [new OpplysningspliktProsessStegPanelDef(), new UttakProsessStegDef()];

    const { result, rerender } = renderHook(
      ({ valgtProsessSteg }) =>
        prosessStegHooks.useProsessStegPaneler(
          definisjoner,
          {},
          fagsak,
          rettigheter,
          behandling as Behandling,
          aksjonspunkter,
          vilkar,
          false,
          valgtProsessSteg,
          undefined,
        ),
      { initialProps: { valgtProsessSteg: prosessStegCodes.UTTAK }, wrapper: medBehandlingProvider },
    );
    expect(result.current[1]?.getUrlKode()).toEqual(prosessStegCodes.UTTAK);

    rerender({ valgtProsessSteg: 'default' });
    expect(result.current[1]?.getUrlKode()).toEqual(prosessStegCodes.OPPLYSNINGSPLIKT);
  });

  it('skal velge første prosess-steg', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(
      stegDef,
      panelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      vilkar,
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const valgtProsessSteg = 'default';

    const { result } = renderHook(() =>
      prosessStegHooks.useProsessStegVelger(
        [utledetPanel],
        valgtFaktaSteg,
        behandling as Behandling,
        oppdaterProsessStegOgFaktaPanelIUrl,
        valgtProsessSteg,
      ),
    );

    const prosessStegVelger = result.current;

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('opplysningsplikt');
    expect(opppdaterKall[0][1]).toEqual('default');
  });

  it('skal skjule prosess-steg når en velger steg som allerede vises', () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(
      stegDef,
      panelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      vilkar,
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const valgtFaktaSteg = 'default';
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const valgtProsessSteg = 'opplysningsplikt';

    const { result } = renderHook(() =>
      prosessStegHooks.useProsessStegVelger(
        [utledetPanel],
        valgtFaktaSteg,
        behandling as Behandling,
        oppdaterProsessStegOgFaktaPanelIUrl,
        valgtProsessSteg,
      ),
    );
    const prosessStegVelger = result.current;

    prosessStegVelger(0);

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toBeUndefined();
    expect(opppdaterKall[0][1]).toEqual('default');
  });

  it('skal bekrefte aksjonspunkt', async () => {
    const isReadOnlyCheck = () => false;
    const toggleOverstyring = () => undefined;
    const stegDef = new OpplysningspliktProsessStegPanelDef();
    const utledetDelPanel = new ProsessStegPanelUtledet(
      stegDef,
      panelDef,
      isReadOnlyCheck,
      aksjonspunkter,
      vilkar,
      {},
      toggleOverstyring,
      kanOverstyreAccess,
      [],
    );
    const utledetPanel = new ProsessStegUtledet(stegDef, [utledetDelPanel]);

    const lagreAksjonspunkter = vi.fn().mockImplementation(() => Promise.resolve());

    const lagringSideEffectsCallback = () => () => {};

    const { result } = renderHook(
      () =>
        prosessStegHooks.useBekreftAksjonspunkt(
          fagsak,
          behandling as Behandling,
          lagringSideEffectsCallback,
          lagreAksjonspunkter,
          undefined,
          utledetPanel,
        ),
      { wrapper: medBehandlingProvider },
    );

    const bekreftAksjonspunkt = result.current;

    await bekreftAksjonspunkt([{ kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU }]);

    const requestKall = lagreAksjonspunkter.mock.calls;
    expect(requestKall).toHaveLength(1);
    expect(requestKall[0]).toHaveLength(2);
    expect(requestKall[0][0]).toEqual({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkter[0].definisjon.kode,
          kode: aksjonspunkter[0].definisjon.kode,
        },
      ],
    });
  });
});
