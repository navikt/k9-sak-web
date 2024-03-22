import React from 'react';
import { screen } from '@testing-library/react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import BostedSokerFaktaIndex, { BostedSokerPersonopplysninger } from './BostedSokerFaktaIndex';
import messages from '../i18n/nb_NO.json';

describe('<BostedSokerFaktaIndex>', () => {
  it('vise rendre komponent korrekt', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(
      <BostedSokerFaktaIndex
        personopplysninger={
          {
            navn: 'Espen Utvikler',
            adresser: [{ adresseType: opplysningAdresseType.BOSTEDSADRESSE }],
            personstatus: personstatusType.BOSATT,
          } as BostedSokerPersonopplysninger
        }
      />,
      { messages },
    );

    expect(screen.getByText('Søker')).toBeInTheDocument();
    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
    expect(screen.getByText('Utenlandsadresse')).toBeInTheDocument();
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
  });
});
