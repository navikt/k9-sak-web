import React from 'react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { render, screen } from '@testing-library/react';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { BostedSokerPersonopplysninger } from '../types';
import { BostedSokerView } from './BostedSokerView';

describe('<BostedsokerView>', () => {
  const soker = {
    navn: 'Espen Utvikler',
    adresser: [
      {
        adresseType: opplysningAdresseType.POSTADRESSE,
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
      },
    ],
    sivilstand: sivilstandType.UGIFT,
    region: 'NORDEN',
    personstatus: 'BOSA',
    avklartPersonstatus: {
      overstyrtPersonstatus: personstatusType.BOSATT,
    },
  } as BostedSokerPersonopplysninger;

  it('vise navn', () => {
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerView personopplysninger={soker} sokerTypeText="BostedSokerFaktaIndex.Soker" />
      </KodeverkProvider>,
    );

    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
  });

  it('skal vise  adresse informasjon', () => {
    render(<BostedSokerView personopplysninger={soker} sokerTypeText="BostedSokerFaktaIndex.Soker" />);
    expect(screen.getByText('Vei 1, 1000 Oslo')).toBeInTheDocument();
  });

  it('skal vise etiketter', () => {
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerView personopplysninger={soker} sokerTypeText="BostedSokerFaktaIndex.Soker" />
      </KodeverkProvider>,
    );
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });

  it('skal vise ukjent når personstatus ukjent', () => {
    soker.avklartPersonstatus = null;
    soker.personstatus = '-';

    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerView personopplysninger={soker} sokerTypeText="BostedSokerFaktaIndex.Soker" />
      </KodeverkProvider>,
    );
    expect(screen.getByText('Ukjent')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });
});
