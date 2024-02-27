import { InputField } from '@fpsak-frontend/form';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import { BehandlingFormFieldCleaner } from './BehandlingFormFieldCleaner';

describe('BehandlingFormFieldCleaner', () => {
  it('skal rendre alle felt og ikke fjerne noe i redux-state', () => {
    const changeCallback = sinon.spy();
    renderWithIntlAndReduxForm(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.getAllByRole('textbox').length).toBe(2);
    expect(changeCallback.getCalls().length).toBe(0);
  });

  it('skal fjerne fomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const { rerender } = renderWithIntlAndReduxForm(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.getAllByRole('textbox').length).toBe(2);
    expect(changeCallback.called).toBe(false);

    rerender(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.getAllByRole('textbox').length).toBe(1);
    expect(changeCallback.getCalls().length).toBe(1);
    const { args } = changeCallback.getCalls()[0];
    expect(args.length).toBe(3);
    expect(args[0]).toEqual('TEST_FORM');
    expect(args[1]).toEqual('fomDato');
    expect(args[2]).toBe(null);
  });

  it('skal fjerne tomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const { rerender } = renderWithIntlAndReduxForm(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.getAllByRole('textbox').length).toBe(2);
    expect(changeCallback.called).toBe(false);

    rerender(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <InputField name="fomDato" />
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.getAllByRole('textbox').length).toBe(1);
    expect(changeCallback.getCalls().length).toBe(1);
    const { args } = changeCallback.getCalls()[0];
    expect(args.length).toBe(3);
    expect(args[0]).toEqual('TEST_FORM');
    expect(args[1]).toEqual('tomDato');
    expect(args[2]).toBe(null);
  });

  it('skal fjerne både fomDato og tomDato fra redux-state', () => {
    const changeCallback = sinon.spy();
    const { rerender } = renderWithIntlAndReduxForm(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <InputField name="fomDato" />
        <div>
          <InputField name="tomDato" />
        </div>
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.getAllByRole('textbox').length).toBe(2);
    expect(changeCallback.called).toBe(false);

    rerender(
      <BehandlingFormFieldCleaner
        behandlingFormName="TEST_FORM"
        fieldNames={['tomDato', 'fomDato']}
        reduxChange={changeCallback}
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
      >
        <span />
      </BehandlingFormFieldCleaner>,
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(changeCallback.getCalls().length).toBe(2);
    const args1 = changeCallback.getCalls()[0].args;
    expect(args1.length).toBe(3);
    expect(args1[0]).toEqual('TEST_FORM');
    expect(args1[1]).toEqual('tomDato');
    expect(args1[2]).toBe(null);
    const args2 = changeCallback.getCalls()[1].args;
    expect(args2.length).toBe(3);
    expect(args2[0]).toEqual('TEST_FORM');
    expect(args2[1]).toEqual('fomDato');
    expect(args2[2]).toBe(null);
  });
});
