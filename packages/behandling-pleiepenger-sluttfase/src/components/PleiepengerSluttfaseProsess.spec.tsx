import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
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
import messages from '../../i18n/nb_NO.json';
import {
  PleiepengerSluttfaseBehandlingApiKeys,
  requestPleiepengerSluttfaseApi,
} from '../data/pleiepengerSluttfaseBehandlingApi';
import FetchedData from '../types/fetchedDataTsType';
import PleiepengerSluttfaseProsess from './PleiepengerSluttfaseProsess';

describe('< PleiepengerSluttfaseProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelseType.FORELDREPENGER, kodeverk: 'test' },
    status: { kode: fagsakStatus.UNDER_BEHANDLING, kodeverk: 'test' },
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
      vilkarType: { kode: vilkarType.SOKERSOPPLYSNINGSPLIKT, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.BEREGNINGSGRUNNLAGVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.MEDLEMSKAPSVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.PLEIEPENGER_LIVETS_SLUTTFASE, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.OPPTJENINGSVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.OMSORGENFORVILKARET, kodeverk: 'test' },
      overstyrbar: true,
      perioder: [
        {
          merknadParametere: {},
          vilkarStatus: { kode: vilkarUtfallType.IKKE_VURDERT, kodeverk: 'test' },
          periode: { fom: '2020-12-30', tom: '2021-02-28' },
        },
      ],
    },
    {
      vilkarType: { kode: vilkarType.SOKNADSFRISTVILKARET, kodeverk: 'test' },
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
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestPleiepengerSluttfaseApi.mock(PleiepengerSluttfaseBehandlingApiKeys.SOKNADSFRIST_STATUS);
    renderWithIntlAndReduxForm(
      <PleiepengerSluttfaseProsess
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
        setBeregningErBehandlet={() => {}}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Inngangsvilkår' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Livets sluttfase/i })).toBeInTheDocument();
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
      <PleiepengerSluttfaseProsess
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
        setBeregningErBehandlet={() => {}}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Beregning/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('beregningsgrunnlag');
    expect(opppdaterKall[0][1]).toEqual('default');
  });
});
