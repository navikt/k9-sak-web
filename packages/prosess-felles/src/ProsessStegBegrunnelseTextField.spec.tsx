import React from 'react';
import { shallow } from 'enzyme';

import { TextAreaField } from '@fpsak-frontend/form';
import { Aksjonspunkt } from '@k9-sak-web/types';

import ProsessStegBegrunnelseTextField from './ProsessStegBegrunnelseTextField';

describe('<ProsessStegBegrunnelseTextField>', () => {
  it('skal vise tekstfelt som ikke readOnly', () => {
    const wrapper = shallow(<ProsessStegBegrunnelseTextField readOnly={false} />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('readOnly')).toBe(false);
  });

  it('skal vise tekstfelt som readOnly', () => {
    const wrapper = shallow(<ProsessStegBegrunnelseTextField readOnly />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('readOnly')).toBe(true);
  });

  it('skal vise default tekstkode', () => {
    const wrapper = shallow(<ProsessStegBegrunnelseTextField readOnly={false} />);

    const textField = wrapper.find(TextAreaField);
    expect(textField.prop('label')).toEqual('Vurdering');
  });

  it('skal vise gitt tekstkode', () => {
    const wrapper = shallow(<ProsessStegBegrunnelseTextField readOnly={false} text="Beskrivelse" />);

    const textField = wrapper.find(TextAreaField);
    expect(textField.prop('label')).toEqual('Beskrivelse');
  });

  it('skal hente begrunnelse fra første aksjonspunkt', () => {
    const aksjonspunkter = [
      {
        begrunnelse: 'test &amp;',
      },
    ] as Aksjonspunkt[];
    const initalValues = ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter);
    expect(initalValues).toEqual({ begrunnelse: 'test &' });
  });
});
