import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

import { VurderRefusjonFormImpl, lagFieldName } from './VurderRefusjonForm';

const { VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT } = faktaOmBeregningTilfelle;

const arbeidsgiverOpplysningerPerId = {
  8279312213: {
    identifikator: '8279312213',
    referanse: '8279312213',
    navn: 'Arbeidsgiveren',
    fødselsdato: null,
  },
  45345345345: {
    identifikator: '45345345345',
    referanse: '45345345345',
    navn: 'Arbeidsgiverto',
    fødselsdato: null,
  },
};

const alleKodeverk = {};


describe('<VurderRefusjonForm>', () => {
  it('skal vise eitt sett med radioknapper om ein arbeidsgiver', () => {
    const senRefusjonkravListe = [{ arbeidsgiverIdent: '8279312213' }];
    const wrapper = shallow(
      <VurderRefusjonFormImpl
        {...reduxFormPropsMock}
        readOnly={false}
        submittable
        submitEnabled
        hasBegrunnelse
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        isAvklaringsbehovClosed={false}
        senRefusjonkravListe={senRefusjonkravListe}
        fieldArrayID="dummyId"
      />,
    );
    const formattedMessage = wrapper.find(FormattedMessage);
    expect(formattedMessage).has.length(1);
    const radioGroup = wrapper.find(RadioGroupField);
    expect(radioGroup).has.length(1);
    const buttons = radioGroup.find(RadioOption);
    expect(buttons).has.length(2);
  });

  it('skal vise to sett med radioknapper om to arbeidsgivere', () => {
    const senRefusjonkravListe = [
      { arbeidsgiverIdent: '8279312213' },
      { arbeidsgiverIdent: '45345345345' },
    ];
    const wrapper = shallow(
      <VurderRefusjonFormImpl
        {...reduxFormPropsMock}
        readOnly={false}
        submittable
        submitEnabled
        hasBegrunnelse
        alleKodeverk={alleKodeverk}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        isAvklaringsbehovClosed={false}
        senRefusjonkravListe={senRefusjonkravListe}
        fieldArrayID="dummyId"        
      />,
    );
    const formattedMessage = wrapper.find(FormattedMessage);
    expect(formattedMessage).has.length(2);
    const radioGroup = wrapper.find(RadioGroupField);
    expect(radioGroup).has.length(2);
  });

  it('skal bygge initial values', () => {
    const senRefusjonkravListe = [
      { arbeidsgiverIdent: '8279312213', erRefusjonskravGyldig: true },
      { arbeidsgiverIdent: '45345345345',  erRefusjonskravGyldig: false },
    ];
    const initialValues = VurderRefusjonFormImpl.buildInitialValues(
      [VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT],
      senRefusjonkravListe,
    );
    expect(initialValues[lagFieldName('8279312213')]).to.equal(true);
    expect(initialValues[lagFieldName('45345345345')]).to.equal(false);
  });

  it('skal bygge transform values', () => {
    const senRefusjonkravListe = [
      {
        arbeidsgiverIdent: '8279312213',
        erRefusjonskravGyldig: true,
      },
      {
        arbeidsgiverIdent: '45345345345',
        erRefusjonskravGyldig: false,
      },
    ];
    const values = {};
    values[lagFieldName('8279312213')] = false;
    values[lagFieldName('45345345345')] = true;
    const transformedValues = VurderRefusjonFormImpl.transformValues(senRefusjonkravListe)(values);
    expect(transformedValues.refusjonskravGyldighet.length).to.equal(2);
    expect(transformedValues.refusjonskravGyldighet[0].arbeidsgiverId).to.equal('8279312213');
    expect(transformedValues.refusjonskravGyldighet[0].skalUtvideGyldighet).to.equal(false);
    expect(transformedValues.refusjonskravGyldighet[1].arbeidsgiverId).to.equal('45345345345');
    expect(transformedValues.refusjonskravGyldighet[1].skalUtvideGyldighet).to.equal(true);
  });
});
