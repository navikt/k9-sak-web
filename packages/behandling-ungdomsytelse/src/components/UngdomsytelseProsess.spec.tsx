import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ung_kodeverk_vilkår_VilkårType as VilkårMedPerioderDtoVilkarType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak, Soknad } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UngdomsytelseBehandlingApiKeys, requestUngdomsytelseApi } from '../data/ungdomsytelseBehandlingApi';
import FetchedData from '../types/FetchedData';
import UngdomsytelseProsess from './UngdomsytelseProsess';

describe('<UngdomsytelseProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.FORELDREPENGER, // FAGSAK_YTELSE
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'FAGSAK_STATUS' },
  } as Fagsak;

  const fagsakPerson = {
    alder: 30,
    personstatusType: { kode: personstatusType.BOSATT, kodeverk: 'test' },
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
  const behandling = {
    id: 1,
    versjon: 2,
    status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'test' },
    type: { kode: behandlingType.FORSTEGANGSSOKNAD, kodeverk: 'test' },
    behandlingPaaVent: false,
    taskStatus: {
      readOnly: false,
    },
    behandlingHenlagt: false,
    links: [],
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
  const aksjonspunkter = [
    {
      definisjon: { kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK, kodeverk: 'test' },
      status: { kode: aksjonspunktStatus.OPPRETTET, kodeverk: 'test' },
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vilkar = [
    {
      vilkarType: { kode: VilkårMedPerioderDtoVilkarType.ALDERSVILKÅR, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
  ];

  const soknad = {
    fodselsdatoer: {
      0: '2019-01-01',
    } as Record<number, string>,
    antallBarn: 1,
    soknadType: {
      kode: soknadType.FODSEL,
      kodeverk: 'test',
    },
  } as Soknad;

  const arbeidsgiverOpplysningerPerId = {
    123: {
      erPrivatPerson: false,
      identifikator: 'testId',
      navn: 'testNavn',
      arbeidsforholdreferanser: [],
    },
  };

  const fetchedData: Partial<FetchedData> = {
    aksjonspunkter,
    vilkar,
    soknad,
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestUngdomsytelseApi.mock(UngdomsytelseBehandlingApiKeys.SOKNADSFRIST_STATUS);
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntlAndReduxForm(
      <UngdomsytelseProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="arbeidsforhold"
        hasFetchError={false}
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Inngangsvilkår' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simulering/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vedtak/i })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntlAndReduxForm(
      <UngdomsytelseProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{
          [kodeverkTyper.AVSLAGSARSAK]: [],
        }}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Vedtak' }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('vedtak');
    expect(opppdaterKall[0][1]).toEqual('default');
  });
});
