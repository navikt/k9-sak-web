import React from 'react';
import { screen } from '@testing-library/react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { BostedSokerPersonopplysninger } from '../BostedSokerFaktaIndex';
import { BostedSokerView } from './BostedSokerView';
import messages from '../../i18n/nb_NO.json';

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
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(
      <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />,
      { messages },
    );

    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
  });

  it('skal vise  adresse informasjon', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(
      <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />,
      { messages },
    );
    expect(screen.getByText('Vei 1, 1000 Oslo')).toBeInTheDocument();
  });

  it('skal vise etiketter', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(
      <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />,
      { messages },
    );
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Nordisk')).toBeInTheDocument();
  });

  it('skal vise ukjent når personstatus ukjent', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    soker.avklartPersonstatus = null;
    soker.personstatus = '-';

    renderWithIntl(
      <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />,
      { messages },
    );
    expect(screen.getByText('Ukjent')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Nordisk')).toBeInTheDocument();
  });
});
