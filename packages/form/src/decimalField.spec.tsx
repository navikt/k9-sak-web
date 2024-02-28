import { messages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import DecimalField from './DecimalField';

describe('<DecimalField>', () => {
  it('skal legge til desimaler på onBlur hvis bruker kun skriver inn heltall', async () => {
    renderWithIntlAndReduxForm(
      <DecimalField
        name="prosent"
        normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
      />,
      { messages, initialValues: { prosent: 10 } },
    );
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    await act(async () => {
      screen.getByDisplayValue('10').focus();
      screen.getByDisplayValue('10').blur();
    });
    expect(screen.queryByDisplayValue('10')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('10.00')).toBeInTheDocument();
  });

  it('skal ikke legge til desimaler på onBlur hvis bruker skriver inn desimal', async () => {
    renderWithIntlAndReduxForm(
      <DecimalField
        name="prosent"
        normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
      />,
      { messages, initialValues: { prosent: 10 } },
    );
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    await act(async () => {
      await userEvent.clear(screen.getByRole('spinbutton'));
      await userEvent.type(screen.getByRole('spinbutton'), '10.32');
      screen.getByRole('spinbutton').blur();
    });
    expect(screen.getByDisplayValue('10.32')).toBeInTheDocument();
  });

  it('skal tilpasse tallet til 2 desimaler', async () => {
    renderWithIntlAndReduxForm(
      <DecimalField
        name="prosent"
        normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
      />,
      { messages, initialValues: { prosent: 10 } },
    );
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    await act(async () => {
      await userEvent.clear(screen.getByRole('spinbutton'));
      await userEvent.type(screen.getByRole('spinbutton'), '10.322843578934758934758934758934758943');
      screen.getByRole('spinbutton').blur();
    });
    expect(screen.getByDisplayValue('10.32')).toBeInTheDocument();
  });
});
