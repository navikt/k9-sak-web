import React from 'react';
import { expect } from 'chai';

import NyIArbeidslivetSNForm from './NyIArbeidslivetSNForm';
import shallowWithIntl from '../../../../i18n';

describe('<NyIArbeidslivetSNForm>', () => {
  it('skal teste at korrekt antall radioknapper vises med korrekte props', () => {
    const wrapper = shallowWithIntl(
      <NyIArbeidslivetSNForm readOnly={false} isAksjonspunktClosed={false} fieldArrayID="dummyId" />,
    );
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(2);
    expect(radios.last().prop('disabled')).is.eql(false);
  });
});
