/* eslint-disable vitest/no-commented-out-tests */
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Behandling, Fagsak, KlageVurdering } from '@k9-sak-web/types';

import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import KlageProsess from './KlageProsess';

describe('<KlageProsess>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: { kode: fagsakYtelsesType.FP, kodeverk: 'FAGSAK_YTELSE' },
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
  const klageVurdering = {
    klageVurderingResultatNK: {
      klageVurdertAv: 'Espen Utvikler',
      godkjentAvMedunderskriver: false,
    },
    klageVurderingResultatNFP: {
      klageVurdertAv: 'Espen Utvikler',
      godkjentAvMedunderskriver: false,
    },
    klageFormkravResultatKA: {
      avvistArsaker: [],
    },
    klageFormkravResultatNFP: {
      avvistArsaker: [],
    },
  } as KlageVurdering;

  it('skal vise alle aktuelle prosessSteg i meny', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <KlageProsess
        data={{ aksjonspunkter, klageVurdering }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleBehandlinger={[]}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
        featureToggles={{}}
      />,
    );

    expect(screen.getByRole('button', { name: /Formkrav Vedtaksinstans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Behandling Vedtaksinstans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resultat/i })).toBeInTheDocument();
  });

  it('skal vise alle aktuelle prosessSteg i meny (frisinn)', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    renderWithIntl(
      <KlageProsess
        data={{ aksjonspunkter, klageVurdering }}
        fagsak={{ ...fagsak, sakstype: { kode: fagsakYtelsesType.FRISINN, kodeverk: 'FAGSAK_YTELSE' } }}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleBehandlinger={[]}
        rettigheter={rettigheter}
        valgtProsessSteg="default"
        oppdaterBehandlingVersjon={vi.fn()}
        oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
        opneSokeside={vi.fn()}
        setBehandling={vi.fn()}
        featureToggles={{}}
      />,
    );

    expect(screen.getByRole('button', { name: /Formkrav Vedtaksinstans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Behandling Vedtaksinstans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Formkrav Klageinstans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Behandling Klageinstans/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Resultat/i })).toBeInTheDocument();
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny (frisinn)', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntl(
      <KlageProsess
        data={{ aksjonspunkter, klageVurdering }}
        fagsak={{ ...fagsak, sakstype: { kode: fagsakYtelsesType.FRISINN, kodeverk: 'FAGSAK_YTELSE' } }}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleBehandlinger={[]}
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
      await userEvent.click(screen.getByRole('button', { name: /Formkrav Klageinstans/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('formkrav_klage_nav_klageinstans');
  });

  it('skal sette nytt valgt prosessSteg ved trykk i meny', async () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    renderWithIntl(
      <KlageProsess
        data={{ aksjonspunkter, klageVurdering }}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        behandling={behandling as Behandling}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleBehandlinger={[]}
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
      await userEvent.click(screen.getByRole('button', { name: /Resultat/i }));
    });

    const opppdaterKall = oppdaterProsessStegOgFaktaPanelIUrl.mock.calls;
    expect(opppdaterKall).toHaveLength(1);
    expect(opppdaterKall[0]).toHaveLength(2);
    expect(opppdaterKall[0][0]).toEqual('resultat');
  });
});
