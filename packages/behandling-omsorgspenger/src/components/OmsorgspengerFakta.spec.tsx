import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { OmsorgspengerBehandlingApiKeys, requestOmsorgApi } from '../data/omsorgspengerBehandlingApi';
import FetchedData from '../types/fetchedDataTsType';
import OmsorgspengerFakta from './OmsorgspengerFakta';

const getbehandlingPerioderårsakMedVilkår = (fom: string, tom: string) => ({
  perioderMedÅrsak: {
    perioderTilVurdering: [{ fom, tom }],
    perioderMedÅrsak: [{ periode: { fom, tom }, årsaker: ['FØRSTEGANGSVURDERING'] }],
    årsakMedPerioder: [{ årsak: 'FØRSTEGANGSVURDERING', perioder: [{ fom, tom }] }],
    dokumenterTilBehandling: [
      {
        journalpostId: '4129401',
        innsendingsTidspunkt: '2023-07-12T00:00:00',
        type: 'INNTEKTSMELDING',
        søktePerioder: [
          {
            periode: { fom, tom },
            type: 'AT',
            arbeidsgiver: { arbeidsgiverOrgnr: '910909088', arbeidsgiverAktørId: null },
            arbeidsforholdRef: null,
          },
          {
            periode: { fom, tom },
            type: 'AT',
            arbeidsgiver: { arbeidsgiverOrgnr: '910909088', arbeidsgiverAktørId: null },
            arbeidsforholdRef: null,
          },
        ],
      },
    ],
  },
  periodeMedUtfall: [{ periode: { fom, tom }, utfall: 'IKKE_VURDERT' }],
  forrigeVedtak: [],
});

describe('<OmsorgspengerFakta>', () => {
  const fagsak = {
    saksnummer: '123456',
    sakstype: fagsakYtelseType.FORELDREPENGER,
    status: fagsakStatus.UNDER_BEHANDLING,
  } as Fagsak;
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
      definisjon: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
      status: aksjonspunktStatus.OPPRETTET,
      kanLoses: true,
      erAktivt: true,
    },
  ];
  const vilkar = [];

  const soker = {
    navn: 'Espen Utvikler',
    aktoerId: '1',
    personstatus: 'BOSA',
    avklartPersonstatus: {
      overstyrtPersonstatus: personstatusType.BOSATT,
      orginalPersonstatus: personstatusType.DOD,
    },
    navBrukerKjonn: '',
    statsborgerskap: '',
    diskresjonskode: '',
    sivilstand: sivilstandType.UGIFT,
    region: 'NORDEN',
    adresser: [
      {
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
        adresseType: opplysningAdresseType.POSTADRESSE,
      },
    ],
    barn: [],
  };

  const arbeidsgiverOpplysningerPerId = {
    123: {
      erPrivatPerson: false,
      identifikator: 'testId',
      navn: 'testNavn',
      arbeidsforholdreferanser: [],
    },
  };

  // const behandlingPerioderårsakMedVilkår =

  it('skal rendre faktapaneler og sidemeny korrekt uten Omsorgen for', () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, undefined);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
      behandlingPerioderårsakMedVilkår: getbehandlingPerioderårsakMedVilkår('2022-05-01', '2022-05-10'),
    };

    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <OmsorgspengerFakta
          data={fetchedData as FetchedData}
          behandling={behandling as Behandling}
          fagsak={fagsak}
          fagsakPerson={fagsakPerson}
          rettigheter={rettigheter}
          alleKodeverk={{}}
          oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
          valgtFaktaSteg="default"
          valgtProsessSteg="default"
          hasFetchError={false}
          setApentFaktaPanel={vi.fn()}
          setBehandling={vi.fn()}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          featureToggles={{}}
          dokumenter={[]}
        />
      </RestApiErrorProvider>,
    );

    expect(screen.getByRole('button', { name: /Arbeidsforhold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inntekt og ytelser/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Omsorgen/i })).not.toBeInTheDocument();
  });

  it('skal rendre faktapaneler og sidemeny korrekt med Omsorgen for', () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, undefined);
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
      behandlingPerioderårsakMedVilkår: getbehandlingPerioderårsakMedVilkår('2023-05-01', '2023-05-10'),
    };

    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <OmsorgspengerFakta
          data={fetchedData as FetchedData}
          behandling={behandling as Behandling}
          fagsak={fagsak}
          fagsakPerson={fagsakPerson}
          rettigheter={rettigheter}
          alleKodeverk={{}}
          oppdaterProsessStegOgFaktaPanelIUrl={vi.fn()}
          valgtFaktaSteg="default"
          valgtProsessSteg="default"
          hasFetchError={false}
          setApentFaktaPanel={vi.fn()}
          setBehandling={vi.fn()}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          featureToggles={{}}
          dokumenter={[]}
        />
      </RestApiErrorProvider>,
    );

    expect(screen.getByRole('button', { name: /Arbeidsforhold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inntekt og ytelser/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Omsorgen for/i })).toBeInTheDocument();
  });

  it('skal oppdatere url ved valg av faktapanel', async () => {
    requestOmsorgApi.mock(OmsorgspengerBehandlingApiKeys.ARBEIDSFORHOLD, undefined);
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };

    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <OmsorgspengerFakta
          data={fetchedData as FetchedData}
          behandling={behandling as Behandling}
          fagsak={fagsak}
          fagsakPerson={fagsakPerson}
          rettigheter={rettigheter}
          alleKodeverk={{}}
          oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
          valgtFaktaSteg="default"
          valgtProsessSteg="default"
          hasFetchError={false}
          setApentFaktaPanel={vi.fn()}
          setBehandling={vi.fn()}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          featureToggles={{}}
          dokumenter={[]}
        />
      </RestApiErrorProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Arbeidsforhold/i }));
    });

    const { calls } = oppdaterProsessStegOgFaktaPanelIUrl.mock;
    expect(calls).toHaveLength(1);
    const args = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('arbeidsforhold');
  });
});
