import React from 'react';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { render, screen } from '@testing-library/react';
import BostedSokerFaktaIndex from './BostedSokerFaktaIndex';
import { BostedSokerPersonopplysninger } from './types';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';

describe('<BostedSokerFaktaIndex>', () => {
  it('vise rendre komponent korrekt', () => {
    // requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    render(
      <KodeverkProvider
        behandlingType={behandlingType.FØRSTEGANGSSØKNAD}
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
    );

    expect(screen.getByText('Søker')).toBeInTheDocument();
    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
    expect(screen.getByText('Utenlandsadresse')).toBeInTheDocument();
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
  });
});
