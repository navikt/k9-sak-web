import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import { renderWithIntl, renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { RestApiErrorProvider } from '@k9-sak-web/rest-api-hooks';
import { Behandling } from '@k9-sak-web/types';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import messages from '../../i18n/nb_NO.json';
import {
  PleiepengerSluttfaseBehandlingApiKeys,
  requestPleiepengerSluttfaseApi,
} from '../data/pleiepengerSluttfaseBehandlingApi';
import FetchedData from '../types/fetchedDataTsType';
import PleiepengerSluttfaseFakta from './PleiepengerSluttfaseFakta';

describe('<PleiepengerSluttfaseFakta>', () => {
  const fagsak: Partial<Fagsak> = {
    saksnummer: '123456',
    sakstype: fagsakYtelsesType.PPN,
    status: fagsakStatus.UNDER_BEHANDLING,
    // fagsakStatus.UNDER_BEHANDLING,
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
    stegTilstand: {
      stegType: {
        kode: '',
      },
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
  const arbeidsforhold = {
    skalKunneLeggeTilNyeArbeidsforhold: true,
    skalKunneLageArbeidsforholdBasertPaInntektsmelding: true,
    relatertTilgrensendeYtelserForAnnenForelder: [],
  };

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

  requestPleiepengerSluttfaseApi.mock(PleiepengerSluttfaseBehandlingApiKeys.ARBEIDSFORHOLD, arbeidsforhold);

  it('skal rendre faktapaneler og sidemeny korrekt', () => {
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
      personopplysninger: soker,
    };

    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <PleiepengerSluttfaseFakta
          data={fetchedData as FetchedData}
          behandling={behandling as Behandling}
          fagsak={fagsak as Fagsak}
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
          dokumenter={[]}
          featureToggles={{}}
        />
      </RestApiErrorProvider>,
      { messages },
    );

    expect(screen.getByRole('button', { name: /Om pleietrengende/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Arbeidsforhold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Livets sluttfase/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inntektsmelding/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inntekt og ytelser/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Utenlandsopphold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Søknadsperioder/i })).toBeInTheDocument();
  });

  it('skal oppdatere url ved valg av faktapanel', async () => {
    const oppdaterProsessStegOgFaktaPanelIUrl = vi.fn();
    const fetchedData: Partial<FetchedData> = {
      aksjonspunkter,
      vilkar,
    };

    renderWithIntlAndReduxForm(
      <RestApiErrorProvider>
        <PleiepengerSluttfaseFakta
          data={fetchedData as FetchedData}
          behandling={behandling as Behandling}
          fagsak={fagsak as Fagsak}
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
          dokumenter={[]}
          featureToggles={{}}
        />
      </RestApiErrorProvider>,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Om pleietrengende/i }));
    });

    const { calls } = oppdaterProsessStegOgFaktaPanelIUrl.mock;
    expect(calls).toHaveLength(1);
    const args = calls[0];
    expect(args).toHaveLength(2);
    expect(args[0]).toEqual('default');
    expect(args[1]).toEqual('om-pleietrengende');
  });
});
