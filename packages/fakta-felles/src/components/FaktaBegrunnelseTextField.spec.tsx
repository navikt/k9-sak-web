import React from 'react';

import { TextAreaField } from '@fpsak-frontend/form';

import shallowWithIntl from '../../i18n/index';
import FaktaBegrunnelseTextField from './FaktaBegrunnelseTextField';

describe('<FaktaBegrunnelseTextField>', () => {
  it('skal ikke vise tekstfelt når en ikke har lov til å løse aksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable={false} hasBegrunnelse={false} />,
    );

    expect(wrapper.find(TextAreaField)).toHaveLength(0);
  });

  it('skal vise tekstfelt når en har lov til å løse aksjonspunkt og en har gjort endringer', () => {
    const wrapper = shallowWithIntl(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} />,
    );

    expect(wrapper.find(TextAreaField)).toHaveLength(1);
  });

  it('skal ikke vise label når readOnly', () => {
    const wrapper = shallowWithIntl(<FaktaBegrunnelseTextField isReadOnly isSubmittable hasBegrunnelse={false} />);

    const textField = wrapper.find(TextAreaField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('label')).toEqual('');
  });

  it('skal vise standard-label når en ikke har valgt å vise vurderingstekst eller sende med tekstkode', () => {
    const wrapper = shallowWithIntl(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} />,
    );

    const textField = wrapper.find(TextAreaField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('label')).toEqual({ id: 'FaktaBegrunnelseTextField.BegrunnEndringene' });
  });

  it('skal vise label for vurdering når dette er markert av prop', () => {
    const wrapper = shallowWithIntl(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} hasVurderingText />,
    );

    const textField = wrapper.find(TextAreaField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('label')).toEqual({ id: 'FaktaBegrunnelseTextField.Vurdering' });
  });

  it('skal vise medsendt label', () => {
    const wrapper = shallowWithIntl(
      <FaktaBegrunnelseTextField isReadOnly={false} isSubmittable hasBegrunnelse={false} label="Test" />,
    );

    const textField = wrapper.find(TextAreaField);
    expect(textField).toHaveLength(1);
    expect(textField.prop('label')).toEqual('Test');
  });
});
