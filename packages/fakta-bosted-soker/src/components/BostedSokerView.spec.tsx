import React from 'react';
import { screen } from '@testing-library/react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';
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
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
  });

  it('skal vise  adresse informasjon', () => {
    renderWithIntl(
      <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />,
      { messages },
    );
    expect(screen.getByText('Vei 1, 1000 Oslo')).toBeInTheDocument();
  });

  it('skal vise etiketter', () => {
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />
      </KodeverkProvider>,
      { messages },
    );
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });

  it('skal vise ukjent når personstatus ukjent', () => {
    soker.avklartPersonstatus = null;
    soker.personstatus = '-';

    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerView intl={intlMock} personopplysninger={soker} sokerTypeTextId="BostedSokerFaktaIndex.Soker" />
      </KodeverkProvider>,
      { messages },
    );
    expect(screen.getByText('Ukjent')).toBeInTheDocument();
    expect(screen.getByText('Ugift')).toBeInTheDocument();
    expect(screen.getByText('Norden')).toBeInTheDocument();
  });
});
