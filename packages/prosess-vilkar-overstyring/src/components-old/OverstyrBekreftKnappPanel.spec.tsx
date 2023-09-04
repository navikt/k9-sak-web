import React from 'react';
import { shallow } from 'enzyme';

import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';

describe('<OverstyrBekreftKnappPanel>', () => {
  it('skal rendre submit-knapp når en ikke er i readonly-modus', () => {
    const wrapper = shallow(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly={false} />);

    const button = wrapper.find('Hovedknapp');
    expect(button).toHaveLength(1);
    expect(button.prop('spinner')).toBe(false);
    expect(button.prop('disabled')).toBe(false);
  });

  it('skal ikke vise submit-knapp når en er i readonly-modus', () => {
    const wrapper = shallow(<OverstyrBekreftKnappPanel submitting={false} pristine={false} overrideReadOnly />);

    const button = wrapper.find('Hovedknapp');
    expect(button).toHaveLength(0);
  });
});
