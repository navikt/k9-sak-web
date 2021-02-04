import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { InputField } from '@fpsak-frontend/form';
import { BehandlingFormFieldCleaner } from './BehandlingFormFieldCleaner';

describe('BehandlingFormFieldCleaner', () => {
  it('skal rendre alle felt og ikke fjerne noe i redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        formName="test"
        behandlingId={1}
        behandlingVersjon={2}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).toHaveLength(2);
    expect(changeCallback.getCalls()).toHaveLength(0);
  });

  it('skal fjerne fomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        formName="test"
        behandlingId={1}
        behandlingVersjon={2}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).toHaveLength(2);
    expect(changeCallback.called).toBe(false);

    // Fjern fomDato fra DOM
    wrapper.setProps({
      children: (
        <div>
          <InputField name="tomDato" />
        </div>
      ),
    });

    const field = wrapper.find(InputField);
    expect(field).toHaveLength(1);
    expect(field.prop('name')).toEqual('tomDato');
    expect(changeCallback.getCalls()).toHaveLength(1);
    const { args } = changeCallback.getCalls()[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('TEST_FORM');
    expect(args[1]).toEqual('fomDato');
    expect(args[2]).toBeNull();
  });

  it('skal fjerne tomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        formName="test"
        behandlingId={1}
        behandlingVersjon={2}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).toHaveLength(2);
    expect(changeCallback.called).toBe(false);

    // Fjern tomDato fra DOM
    wrapper.setProps({
      children: <InputField name="fomDato" />,
    });

    const field = wrapper.find(InputField);
    expect(field).toHaveLength(1);
    expect(field.prop('name')).toEqual('fomDato');
    expect(changeCallback.getCalls()).toHaveLength(1);
    const { args } = changeCallback.getCalls()[0];
    expect(args).toHaveLength(3);
    expect(args[0]).toEqual('TEST_FORM');
    expect(args[1]).toEqual('tomDato');
    expect(args[2]).toBeNull();
  });

  it('skal fjerne både fomDato og tomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const wrapper = shallow(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        formName="test"
        behandlingId={1}
        behandlingVersjon={2}
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(wrapper.find(InputField)).toHaveLength(2);
    expect(changeCallback.called).toBe(false);

    // Fjern tomDato fra DOM
    wrapper.setProps({
      children: <span />,
    });

    expect(wrapper.find(InputField)).toHaveLength(0);
    expect(changeCallback.getCalls()).toHaveLength(2);
    const args1 = changeCallback.getCalls()[0].args;
    expect(args1).toHaveLength(3);
    expect(args1[0]).toEqual('TEST_FORM');
    expect(args1[1]).toEqual('tomDato');
    expect(args1[2]).toBeNull();
    const args2 = changeCallback.getCalls()[1].args;
    expect(args2).toHaveLength(3);
    expect(args2[0]).toEqual('TEST_FORM');
    expect(args2[1]).toEqual('fomDato');
    expect(args2[2]).toBeNull();
  });
});
