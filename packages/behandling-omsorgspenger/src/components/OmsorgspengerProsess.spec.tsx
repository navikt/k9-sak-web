import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakStatus from '@k9-sak-web/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import soknadType from '@k9-sak-web/kodeverk/src/soknadType';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak, Soknad } from '@k9-sak-web/types';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import FetchedData from '../types/fetchedDataTsType';
import OmsorgspengerProsess from './OmsorgspengerProsess';

describe('<OmsorgspengerProsess>', () => {
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
    renderWithIntlAndReduxForm(
      <OmsorgspengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
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
      <OmsorgspengerProsess
        data={fetchedData as FetchedData}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
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
      await userEvent.click(screen.getByRole('button', { name: /Tilkjent ytelse/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('tilkjent_ytelse');
    expect(opppdaterKall[0][1]).toEqual('default');
  });
});
