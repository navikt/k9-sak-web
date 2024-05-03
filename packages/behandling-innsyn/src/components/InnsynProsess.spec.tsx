import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import fagsakStatus from '@k9-sak-web/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import innsynResultatType from '@k9-sak-web/kodeverk/src/innsynResultatType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak, Vilkar } from '@k9-sak-web/types';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import InnsynProsess from './InnsynProsess';

describe('<InnsynProsess>', () => {
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
      vilkarType: { kode: vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, kodeverk: 'test' },
      overstyrbar: true,
    } as Vilkar,
  ];
  const innsyn = {
    dokumenter: [],
    innsynMottattDato: '2020.10.10',
    innsynResultatType: {
      kode: innsynResultatType.INNVILGET,
      kodeverk: 'INNSYN_RESULTAT_TYPE',
    },
    vedtaksdokumentasjon: [
      {
        dokumentId: '1',
        tittel: 'test',
        opprettetDato: '2020.01.01',
      },
    ],
  };
  const innsynDokumenter = [];

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <InnsynProsess
        data={{
          aksjonspunkter,
          vilkar,
          innsyn,
          innsynDokumenter,
        }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
        featureToggles={{}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Behandle innsyn' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vedtak/i })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntl(
      <InnsynProsess
        data={{
          aksjonspunkter,
          vilkar,
          innsyn,
          innsynDokumenter,
        }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
        featureToggles={{}}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Vedtak/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('vedtak');
  });
});
