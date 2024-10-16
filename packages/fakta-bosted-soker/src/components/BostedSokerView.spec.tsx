import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { render, screen } from '@testing-library/react';
import { BostedSokerPersonopplysninger } from '../types';
import { BostedSokerView } from './BostedSokerView';

describe('<BostedsokerView>', () => {
  const soker = {
    navn: 'Espen Utvikler',
    adresser: [
      {
        adresseType: {
          kode: opplysningAdresseType.POSTADRESSE,
          navn: 'Bostedsadresse',
        },
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
      },
    ],
    sivilstand: {
      kode: sivilstandType.UGIFT,
      navn: 'Ugift',
    },
    region: {
      kode: 'NORDEN',
      navn: 'Norden',
    },
    personstatus: {
      kode: 'BOSA',
      navn: 'Bosatt',
    },
    avklartPersonstatus: {
      overstyrtPersonstatus: {
        kode: personstatusType.BOSATT,
        navn: 'Bosatt',
      },
    },
  } as BostedSokerPersonopplysninger;

  const regionTypes = [
    {
      kode: 'NORDEN',
      navn: 'Norden',
    },
  ] as KodeverkMedNavn[];

  const sivilstandTypes = [
    {
      kode: sivilstandType.UGIFT,
      navn: 'Ugift',
    },
  ] as KodeverkMedNavn[];

  const personstatusTypes = [
    {
      kode: personstatusType.BOSATT,
      navn: 'Bosatt',
    },
    {
      kode: personstatusType.DOD,
      navn: 'Bosatt',
    },
  ] as KodeverkMedNavn[];

  it('vise navn', () => {
    render(
      <BostedSokerView
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeText="BostedSokerFaktaIndex.Soker"
      />,
    );

    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
  });

  it('skal vise  adresse informasjon', () => {
    render(
      <BostedSokerView
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeText="BostedSokerFaktaIndex.Soker"
      />,
    );
    expect(screen.getByText('Vei 1, 1000 Oslo')).toBeInTheDocument();
  });

  it('skal vise etiketter', () => {
    render(
      <BostedSokerView
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeText="BostedSokerFaktaIndex.Soker"
      />,
    );
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });

  it('skal vise ukjent når personstatus ukjent', () => {
    soker.avklartPersonstatus = null;
    soker.personstatus = {
      navn: '',
      kode: '-',
    } as KodeverkMedNavn;

    render(
      <BostedSokerView
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeText="BostedSokerFaktaIndex.Soker"
      />,
    );
    expect(screen.getByText('Ukjent')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });
});
