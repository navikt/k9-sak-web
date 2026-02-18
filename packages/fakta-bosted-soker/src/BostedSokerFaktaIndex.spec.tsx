import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { render, screen } from '@testing-library/react';
import BostedSokerFaktaIndex from './BostedSokerFaktaIndex';
import { BostedSokerPersonopplysninger } from './types';

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
    render(
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
    );

    expect(screen.getByText('Søker')).toBeInTheDocument();
    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
    expect(screen.getByText('Utenlandsadresse')).toBeInTheDocument();
    expect(screen.getByText('Bosatt')).toBeInTheDocument();
  });
});
