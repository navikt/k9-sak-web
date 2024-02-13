import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { reduxForm } from 'redux-form';
import messages from '../../../../i18n/nb_NO.json';
import BelopetMottattIGodTroFormPanel from './BelopetMottattIGodTroFormPanel';

describe('<BelopetMottattIGodTroFormPanel>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);

  it('skal måtte oppgi beløp som skal tilbakekreves når beløpet er i behold', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <BelopetMottattIGodTroFormPanel readOnly={false} erBelopetIBehold />
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Angi beløp som skal tilbakekreves' })).toBeInTheDocument();
  });

  it('skal ikke måtte oppgi beløp som skal tilbakekreves når beløpet ikke er i behold', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <BelopetMottattIGodTroFormPanel readOnly={false} erBelopetIBehold={false} />
      </MockForm>,
      { messages },
    );

    expect(screen.queryByRole('textbox', { name: 'Angi beløp som skal tilbakekreves' })).not.toBeInTheDocument();
  });
});
