import { renderFieldComponent } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import { RenderCheckboxField } from './CheckboxField';

describe('<CheckboxField>', () => {
  it('skal kalle onChange med boolsk verdi for checked', async () => {
    const onChange = sinon.spy();
    renderFieldComponent(<RenderCheckboxField input={undefined} meta={undefined} />, { onChange });

    await act(async () => {
      await userEvent.click(screen.getByRole('checkbox', { name: 'field' }));
    });

    expect(onChange.called).toBe(true);
    const { args } = onChange.getCalls()[0];
    expect(args).toHaveLength(1);
    expect(args[0]).toBe(true);

    await act(async () => {
      await userEvent.click(screen.getByRole('checkbox', { name: 'field' }));
    });
    const args2 = onChange.getCalls()[0].args;
    expect(args2).toHaveLength(1);
    expect(args2[0]).toBe(true);
  });

  it('skal initialisere checked med verdi fra input', () => {
    renderFieldComponent(<RenderCheckboxField input={undefined} meta={undefined} />, { value: true });
    expect(screen.getByDisplayValue('true')).toBeInTheDocument();

    renderFieldComponent(<RenderCheckboxField input={undefined} meta={undefined} />, { value: false });
    expect(screen.getByDisplayValue('false')).toBeInTheDocument();
  });
});
