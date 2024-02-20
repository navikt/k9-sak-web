import React from 'react';
import { expect } from 'chai';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FormkravKlageFormKa } from './FormkravKlageFormKa';
import FormkravKlageForm from './FormkravKlageForm';

import shallowWithIntl, { intlMock } from '../../i18n';

describe('<FormkravKlageFormKa>', () => {
  it('skal initiere form', () => {
    const wrapper = shallowWithIntl(
      <FormkravKlageFormKa
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA}
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        fagsakPerson={{}}
        avsluttedeBehandlinger={[]}
        parterMedKlagerett={[]}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(FormkravKlageForm)).has.length(1);
  });
});
