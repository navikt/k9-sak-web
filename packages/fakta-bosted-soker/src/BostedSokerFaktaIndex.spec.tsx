import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import BostedSokerFaktaIndex, { BostedSokerPersonopplysninger } from './BostedSokerFaktaIndex';

describe('<BostedSokerFaktaIndex>', () => {
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
  it('vise rendre komponent korrekt', () => {
    renderWithIntl(
      <BostedSokerFaktaIndex
        personopplysninger={
          {
            navn: 'Espen Utvikler',
            adresser: [
              {
                adresseType: {
                  kode: opplysningAdresseType.BOSTEDSADRESSE,
                },
              },
            ],
            personstatus: {
              kode: personstatusType.BOSATT,
            },
          } as BostedSokerPersonopplysninger
        }
        alleKodeverk={{ PersonstatusType: personstatusTypes }}
      />,
      { messages },
    );

    expect(screen.getByText('Søker')).toBeInTheDocument();
    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
    expect(screen.getByText('Utenlandsadresse')).toBeInTheDocument();
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
  });
});
