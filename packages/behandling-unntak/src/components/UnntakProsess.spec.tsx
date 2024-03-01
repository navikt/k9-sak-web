import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import { UnntakBehandlingApiKeys, requestUnntakApi } from '../data/unntakBehandlingApi';
import FetchedData from '../types/fetchedDataTsType';
import UnntakProsess from './UnntakProsess';

describe('<UnntakProsess>', () => {
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
      vilkarType: { kode: vilkarType.MEDLEMSKAPSVILKARET, kodeverk: 'test' },
      overstyrbar: true,
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
  };

  const alleKodeverk = {
    Avslagsårsak: {
      FP_VK_2: [
        {
          kode: '1020',
          navn: 'Søker er ikke medlem',
          kodeverk: 'AVSLAGSARSAK',
        },
        {
          kode: '1025',
          navn: 'Søker er ikke bosatt',
          kodeverk: 'AVSLAGSARSAK',
        },
        {
          kode: '1023',
          navn: 'Søker har ikke lovlig opphold',
          kodeverk: 'AVSLAGSARSAK',
        },
        {
          kode: '1024',
          navn: 'Søker har ikke oppholdsrett',
          kodeverk: 'AVSLAGSARSAK',
        },
        {
          kode: '1021',
          navn: 'Søker er utvandret',
          kodeverk: 'AVSLAGSARSAK',
        },
      ],
    },
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    requestUnntakApi.mock(UnntakBehandlingApiKeys.MEDLEMSKAP, []);
    renderWithIntlAndReduxForm(
      <UnntakProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={alleKodeverk as any}
        rettigheter={rettigheter}
        valgtProsessSteg="inngangsvilkar"
        valgtFaktaSteg="arbeidsforhold"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={sinon.spy()}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Inngangsvilkår' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manuell Behandling' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tilkjent ytelse' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simulering' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vedtak' })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);

    const oppdaterProsessStegOgFaktaPanelIUrl = sinon.spy();
    renderWithIntlAndReduxForm(
      <UnntakProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={alleKodeverk as any}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        valgtFaktaSteg="default"
        hasFetchError={false}
        oppdaterBehandlingVersjon={sinon.spy()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={sinon.spy()}
        setBehandling={sinon.spy()}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        featureToggles={{}}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Vedtak' }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.getCalls();
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0].args).toHaveLength(2);
    expect(opppdaterKall[0].args[0]).toEqual('vedtak');
    expect(opppdaterKall[0].args[1]).toEqual('default');
  });
});
