import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-fakta-uttak';
import { OmsorgenForFaktaFormImpl } from './OmsorgenForFaktaForm';
import Spørsmål from './Spørsmål';

it('Rendrer spørsmål', () => {
  const wrapper = shallowWithIntl(
    <OmsorgenForFaktaFormImpl
      behandlingId={1}
      behandlingVersjon={1}
      formValues={{
        søkerDelerAdresseMedBarn: true,
        harFosterbarn: true,
      }}
      submitCallback={() => undefined}
      {...reduxFormPropsMock}
    />,
  );

  const spørsmål = wrapper.find(Spørsmål);

  expect(spørsmål).to.have.length(5);
});
