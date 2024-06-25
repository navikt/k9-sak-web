import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { Behandling, Fagsak, Vilkar } from '@k9-sak-web/types';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import AnkeProsess from './AnkeProsess';

describe('<AnkeProsess>', () => {
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
      definisjon: aksjonspunktCodes.AVKLAR_AKTIVITETER,
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vilkar = [
    {
      vilkarType: vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
      overstyrbar: true,
    } as Vilkar,
  ];
  const ankeVurdering = {
    ankeVurderingResultat: undefined,
  };

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <AnkeProsess
        data={{ aksjonspunkter, vilkar, ankeVurdering }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        alleBehandlinger={[]}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Ankebehandling' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Resultat' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Merknader' })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntl(
      <AnkeProsess
        data={{ aksjonspunkter, vilkar, ankeVurdering }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        alleBehandlinger={[]}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
      />,
    );
    userEvent.click(screen.getByRole('button', { name: 'Merknader' }));
    await waitFor(() => {
      expect(oppdaterProsessStegOgFaktaPanelIUrl.mock.calls.length).toBeGreaterThan(0);
    });
    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('ankemerknader');
  });
});
