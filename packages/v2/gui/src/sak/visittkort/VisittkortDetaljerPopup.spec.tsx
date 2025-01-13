import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';
import type { Personopplysninger } from './types/Personopplysninger';

describe('<VisittkortDetaljerPopup>', () => {
  const personopplysningerSoker: Personopplysninger = {
    navBrukerKjonn: 'KVINNE', // NAV_BRUKER_KJONN
    avklartPersonstatus: {
      orginalPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
      overstyrtPersonstatus: 'BOSA', // PERSONSTATUS_TYPE
    },
    personstatus: 'BOSA', // PERSONSTATUS_TYPE
    diskresjonskode: 'KLIENT_ADRESSE', // DISKRESJONSKODE_TYPE
    sivilstand: 'SAMB', // SIVILSTAND_TYPE
    aktoerId: '24sedfs32',
    navn: 'Olga Utvikler',
    adresser: [
      {
        adresseType: 'BOSTEDSADRESSE', // ADRESSE_TYPE
        adresselinje1: 'Oslo',
        land: 'Norge',
        postNummer: '1234',
        poststed: 'Oslo',
      },
    ],
    fnr: '98773895',
    region: 'NORDEN', // REGION
    barnSoktFor: [],
    fodselsdato: '1990-01-01',
    harVerge: false,
  };

  it('skal vise etiketter', () => {
    render(<VisittkortDetaljerPopup personopplysninger={personopplysningerSoker} sprakkode="NN" />);
    expect(screen.getByLabelText('Statsborgerskap')).toBeInTheDocument();
    expect(screen.getByLabelText('Personstatus')).toBeInTheDocument();
    expect(screen.getByLabelText('Sivilstand')).toBeInTheDocument();
    expect(screen.getByLabelText('Foretrukket språk')).toBeInTheDocument();
  });

  it('skal vise adresser', () => {
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <VisittkortDetaljerPopup personopplysninger={personopplysningerSoker} sprakkode="NN" />
      </KodeverkProvider>,
    );

    expect(screen.getByText('Bostedsadresse')).toBeInTheDocument();
    expect(screen.getByText('Oslo, 1234 Oslo Norge')).toBeInTheDocument();
  });
});
