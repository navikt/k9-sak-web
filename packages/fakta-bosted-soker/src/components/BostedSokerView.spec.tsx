import opplysningAdresseType from '@k9-sak-web/kodeverk/src/opplysningAdresseType';
import personstatusType from '@k9-sak-web/kodeverk/src/personstatusType';
import sivilstandType from '@k9-sak-web/kodeverk/src/sivilstandType';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { BostedSokerPersonopplysninger } from '../BostedSokerFaktaIndex';
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
    renderWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
      { messages },
    );

    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
  });

  it('skal vise  adresse informasjon', () => {
    renderWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
      { messages },
    );
    expect(screen.getByText('Vei 1, 1000 Oslo')).toBeInTheDocument();
  });

  it('skal vise etiketter', () => {
    renderWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
      { messages },
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

    renderWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
      { messages },
    );
    expect(screen.getByText('Ukjent')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });
});
