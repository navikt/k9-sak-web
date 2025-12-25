import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { ArbeidsgiverOpplysningerWrapper, BehandlingAppKontekst, Fagsak } from '@k9-sak-web/types';

import { renderWithIntlAndReactQueryClient } from '@fpsak-frontend/utils-test/test-utils';
import { VergeBehandlingmenyValg } from '../behandling/behandlingRettigheterTsType';
import { K9sakApiKeys, requestApi } from '../data/k9sakApi';
import BehandlingSupportIndex, { hentSynligePaneler, hentValgbarePaneler } from './BehandlingSupportIndex';
import type PersonopplysningerTsType from '@k9-sak-web/types/src/personopplysningerTsType.js';

describe('<BehandlingSupportIndex>', () => {
  const fagsak = {
    saksnummer: '123',
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

  const behandling = {
    id: 1,
    type: {
      kode: behandlingType.FORSTEGANGSSOKNAD,
      kodeverk: '',
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: '',
    },
  };

  // Kopiert inn frå testmiljø
  const personopplysninger: PersonopplysningerTsType = {
    aktoerId: '2329506401084',
    diskresjonskode: {
      kode: 'UDEF',
      kodeverk: 'DISKRESJONSKODE',
    },
    fnr: '05489418950',
    adresser: [
      {
        adresselinje1: 'Slettåsvegen 1351',
        adresseType: {
          kode: 'BOSTEDSADRESSE',
          kodeverk: 'ADRESSE_TYPE',
        },
        land: 'NOR',
        mottakerNavn: 'Spasertur Hensiktsmessig',
        postNummer: '2432',
      },
    ],
    avklartPersonstatus: {
      orginalPersonstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      overstyrtPersonstatus: {
        kode: 'BOSA',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    },
    barn: [
      {
        aktoerId: '2640425550298',
        diskresjonskode: {
          kode: 'UDEF',
          kodeverk: 'DISKRESJONSKODE',
        },
        fnr: '26441878159',
        adresser: [
          {
            adresselinje1: 'Slettåsvegen 1351',
            adresseType: {
              kode: 'BOSTEDSADRESSE',
              kodeverk: 'ADRESSE_TYPE',
            },
            land: 'NOR',
            mottakerNavn: 'Interesse Uinspirert',
            postNummer: '2432',
          },
        ],
        avklartPersonstatus: {
          orginalPersonstatus: {
            kode: 'BOSA',
            kodeverk: 'PERSONSTATUS_TYPE',
          },
          overstyrtPersonstatus: {
            kode: 'BOSA',
            kodeverk: 'PERSONSTATUS_TYPE',
          },
        },
        fodselsdato: '2018-04-26',
        harVerge: false,
        navBrukerKjonn: {
          kode: 'M',
          kodeverk: 'BRUKER_KJOENN',
        },
        navn: 'Interesse Uinspirert',
        personstatus: {
          kode: 'BOSA',
          kodeverk: 'PERSONSTATUS_TYPE',
        },
        region: {
          kode: 'NORDEN',
          kodeverk: 'REGION',
        },
        sivilstand: {
          kode: 'UGIF',
          kodeverk: 'SIVILSTAND_TYPE',
        },
        statsborgerskap: {
          kode: 'NOR',
          kodeverk: 'LANDKODER',
          navn: 'NOR',
        },
      },
    ],
    fodselsdato: '1994-08-05',
    harVerge: false,
    navBrukerKjonn: {
      kode: 'M',
      kodeverk: 'BRUKER_KJOENN',
    },
    navn: 'Spasertur Hensiktsmessig',
    personstatus: {
      kode: 'BOSA',
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    region: {
      kode: 'NORDEN',
      kodeverk: 'REGION',
    },
    sivilstand: {
      kode: 'UGIF',
      kodeverk: 'SIVILSTAND_TYPE',
    },
    statsborgerskap: {
      kode: 'NOR',
      kodeverk: 'LANDKODER',
      navn: 'NOR',
    },
  };

  const arbeidsgiverOpplysninger: ArbeidsgiverOpplysningerWrapper = {
    arbeidsgivere: {},
  };

  it('skal vise godkjennings-panelet', () => {
    requestApi.mock(K9sakApiKeys.NAV_ANSATT, navAnsatt);
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});

    renderWithIntlAndReactQueryClient(
      <MemoryRouter>
        <BehandlingSupportIndex
          fagsak={fagsak as Fagsak}
          alleBehandlinger={[behandling] as BehandlingAppKontekst[]}
          behandlingId={1}
          behandlingVersjon={2}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysninger={arbeidsgiverOpplysninger}
          navAnsatt={navAnsatt}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('tab').length).toBe(4);
  });

  describe('hentSynligePaneler', () => {
    it('skal kunne aksessere alle support-paneler', () => {
      const behandlingRettigheter = {
        behandlingFraBeslutter: true,
        behandlingKanSendeMelding: true,
        behandlingTilGodkjenning: true,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: true,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const accessiblePanels = hentSynligePaneler(behandlingRettigheter);

      expect(accessiblePanels).toEqual([
        'TIL_BESLUTTER',
        'FRA_BESLUTTER',
        'HISTORIKK',
        'MELDINGER',
        'DOKUMENTER',
        'NOTATER',
      ]);
    });

    it('skal kunne aksessere kun supportpanelene som alltid vises; historikk og dokumenter', () => {
      const behandlingRettigheter = {
        behandlingFraBeslutter: false,
        behandlingKanSendeMelding: false,
        behandlingTilGodkjenning: false,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: false,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const accessiblePanels = hentSynligePaneler(behandlingRettigheter);

      expect(accessiblePanels).toEqual(['HISTORIKK', 'MELDINGER', 'DOKUMENTER', 'NOTATER']);
    });
  });

  describe('hentValgbarePaneler', () => {
    it('skal vise alle support-panelene som valgbare', () => {
      const accessibleSupportPanels = ['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER'];

      const behandlingRettigheter = {
        behandlingFraBeslutter: true,
        behandlingKanSendeMelding: true,
        behandlingTilGodkjenning: false,
        behandlingKanBytteEnhet: true,
        behandlingKanHenlegges: true,
        behandlingKanGjenopptas: false,
        behandlingKanOpnesForEndringer: true,
        behandlingKanSettesPaVent: true,
        vergeBehandlingsmeny: VergeBehandlingmenyValg.OPPRETT,
      };

      const enabledPanels = hentValgbarePaneler(accessibleSupportPanels, behandlingRettigheter);

      expect(enabledPanels).toEqual(['TIL_BESLUTTER', 'FRA_BESLUTTER', 'HISTORIKK', 'MELDINGER', 'DOKUMENTER']);
    });
  });
});
