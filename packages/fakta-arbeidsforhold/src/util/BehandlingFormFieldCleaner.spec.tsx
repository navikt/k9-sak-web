import { InputField } from '@k9-sak-web/form';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { BehandlingFormFieldCleaner } from './BehandlingFormFieldCleaner';

describe('BehandlingFormFieldCleaner', () => {
  it('skal rendre alle felt og ikke fjerne noe i redux-state', () => {
    const changeCallback = vi.fn();
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
    expect(changeCallback.mock.calls.length).toBe(0);
  });

  it('skal fjerne fomDato fra redux-state', () => {
    const changeCallback = vi.fn();
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
    expect(changeCallback.mock.calls.length).toBe(0);

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
    expect(changeCallback.mock.calls.length).toBe(1);
    const args = changeCallback.mock.calls[0];
    expect(args.length).toBe(3);
    expect(args[0]).toEqual('TEST_FORM');
    expect(args[1]).toEqual('fomDato');
    expect(args[2]).toBe(null);
  });

  it('skal fjerne tomDato fra redux-state', () => {
    const changeCallback = vi.fn();
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
    expect(changeCallback.mock.calls.length).toBe(0);

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
    expect(changeCallback.mock.calls.length).toBe(1);
    const args = changeCallback.mock.calls[0];
    expect(args.length).toBe(3);
    expect(args[0]).toEqual('TEST_FORM');
    expect(args[1]).toEqual('tomDato');
    expect(args[2]).toBe(null);
  });

  it('skal fjerne både fomDato og tomDato fra redux-state', () => {
    const changeCallback = vi.fn();
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
    expect(changeCallback.mock.calls.length).toBe(0);

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
    expect(changeCallback.mock.calls.length).toBe(2);
    const args1 = changeCallback.mock.calls[0];
    expect(args1.length).toBe(3);
    expect(args1[0]).toEqual('TEST_FORM');
    expect(args1[1]).toEqual('tomDato');
    expect(args1[2]).toBe(null);
    const args2 = changeCallback.mock.calls[1];
    expect(args2.length).toBe(3);
    expect(args2[0]).toEqual('TEST_FORM');
    expect(args2[1]).toEqual('fomDato');
    expect(args2[2]).toBe(null);
  });
});
