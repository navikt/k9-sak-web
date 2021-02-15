import React from 'react';
import { shallow } from 'enzyme';

import { InputField } from '@fpsak-frontend/form';

import BelopetMottattIGodTroFormPanel from './BelopetMottattIGodTroFormPanel';

describe('<BelopetMottattIGodTroFormPanel>', () => {
  it('skal måtte oppgi beløp som skal tilbakekreves når beløpet er i behold', () => {
    const wrapper = shallow(<BelopetMottattIGodTroFormPanel readOnly={false} erBelopetIBehold />);

    expect(wrapper.find(InputField)).toHaveLength(1);
  });

  it('skal ikke måtte oppgi beløp som skal tilbakekreves når beløpet ikke er i behold', () => {
    const wrapper = shallow(<BelopetMottattIGodTroFormPanel readOnly={false} erBelopetIBehold={false} />);

    expect(wrapper.find(InputField)).toHaveLength(0);
  });
});
