import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import UttakFaktaIndex from '@fpsak-frontend/fakta-uttak/src/UttakFaktaIndex';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

class UttakFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.UTTAK;

  getTekstKode = () => 'UttakInfoPanel.FaktaUttak';

  getKomponent = props => <UttakFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ personopplysninger }) => !!personopplysninger;

  getData = ({ personopplysninger }) => ({
    personopplysninger,
    arbeidDto: [
      {
        arbeidsforhold: {
          aktørId: null,
          arbeidsforholdId: '123456',
          organisasjonsnummer: '999999999',
          type: 'Arbeidsgiver',
        },
        perioder: {
          '2020-01-01/2020-02-01': {
            jobberNormaltPerUke: 'PT37H30M',
            skalJobbeProsent: '80',
          },
        },
      },
    ],
  });
}

export default UttakFaktaPanelDef;
