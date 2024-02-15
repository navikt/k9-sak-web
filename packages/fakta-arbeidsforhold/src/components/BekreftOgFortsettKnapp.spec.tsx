import { shallow } from 'enzyme';
import React from 'react';

import { Hovedknapp } from 'nav-frontend-knapper';
import { BekreftOgForsettKnapp } from './BekreftOgForsettKnapp';

describe('<BekreftOgForsettKnapp>', () => {
  it('Skal vise en enablet hovedknapp hvis readOnly og isSubmitting er false', () => {
    const wrapper = shallow(<BekreftOgForsettKnapp readOnly={false} isSubmitting={false} />);
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(false);
  });
  it('Skal vise en disablet hovedknapp hvis readOnly er true', () => {
    const wrapper = shallow(<BekreftOgForsettKnapp readOnly isSubmitting={false} />);
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(true);
  });
  it('Skal vise en disablet hovedknapp hvis isSubmitting er true', () => {
    const wrapper = shallow(<BekreftOgForsettKnapp readOnly={false} isSubmitting />);
    const hovedKnapp = wrapper.find(Hovedknapp);
    expect(hovedKnapp).has.length(1);
    expect(hovedKnapp.props().disabled).to.eql(true);
  });
});
