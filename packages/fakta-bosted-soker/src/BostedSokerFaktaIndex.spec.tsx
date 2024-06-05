import React from 'react';
import { screen } from '@testing-library/react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import BostedSokerFaktaIndex, { BostedSokerPersonopplysninger } from './BostedSokerFaktaIndex';
import messages from '../i18n/nb_NO.json';

describe('<BostedSokerFaktaIndex>', () => {
  it('vise rendre komponent korrekt', () => {
    // requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BostedSokerFaktaIndex
          personopplysninger={
            {
              navn: 'Espen Utvikler',
              adresser: [{ adresseType: opplysningAdresseType.BOSTEDSADRESSE }],
              personstatus: personstatusType.BOSATT,
            } as BostedSokerPersonopplysninger
          }
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByText('Søker')).toBeInTheDocument();
    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
    expect(screen.getByText('Utenlandsadresse')).toBeInTheDocument();
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
  });
});
