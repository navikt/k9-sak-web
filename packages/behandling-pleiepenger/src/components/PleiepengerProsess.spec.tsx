import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak, Soknad } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { PleiepengerBehandlingApiKeys, requestPleiepengerApi } from '../data/pleiepengerBehandlingApi';
import FetchedData from '../types/FetchedData';
import PleiepengerProsess from './PleiepengerProsess';

describe('<PleiepengerProsess>', () => {
  const fagsak: Fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.OMP,
    status: fagsakStatus.UNDER_BEHANDLING,
    relasjonsRolleType: '',
    barnFodt: '',
    person: {
      erDod: false,
      navn: '',
      alder: 0,
      personnummer: '',
      erKvinne: false,
      personstatusType: '',
      diskresjonskode: '',
      dodsdato: '',
      aktørId: '',
    },
    opprettet: '',
    endret: '',
    antallBarn: 0,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 0,
  };

  const fagsakPerson = {
    alder: 30,
    personstatusType: personstatusType.BOSATT,
    erDod: false,
    erKvinne: true,
    navn: 'Espen Utvikler',
    personnummer: '12345',
  };
  const behandling = {
    id: 1,
    versjon: 2,
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: behandlingType.FORSTEGANGSSOKNAD,
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
      definisjon: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vilkar = [
    {
      vilkarType: vilkarType.SOKERSOPPLYSNINGSPLIKT,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.BEREGNINGSGRUNNLAGVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.MEDLEMSKAPSVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.OPPTJENINGSVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.OMSORGENFORVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: vilkarType.SOKNADSFRISTVILKARET,
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: vilkarUtfallType.IKKE_VURDERT,
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
    soknadType: soknadType.FODSEL,
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
    requestPleiepengerApi.mock(PleiepengerBehandlingApiKeys.SOKNADSFRIST_STATUS);
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntlAndReduxForm(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
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
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Inngangsvilkår' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sykdom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inngangsvilkår Fortsettelse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Beregning/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Uttak/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tilkjent ytelse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simulering/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vedtak/i })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntlAndReduxForm(
      <PleiepengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
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
        setBeregningErBehandlet={() => {}}
        lagreOverstyringUttak={vi.fn()}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Inngangsvilkår Fortsettelse' }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('opptjening');
    expect(opppdaterKall[0][1]).toEqual('default');
  });
});
