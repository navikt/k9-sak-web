import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import BelopetMottattIGodTroFormPanel from './BelopetMottattIGodTroFormPanel';

describe('<BelopetMottattIGodTroFormPanel>', () => {
  it('skal måtte oppgi beløp som skal tilbakekreves når beløpet er i behold', () => {
    renderWithIntlAndReduxForm(<BelopetMottattIGodTroFormPanel readOnly={false} erBelopetIBehold />, { messages });

    expect(screen.getByRole('textbox', { name: 'Angi beløp som skal tilbakekreves' })).toBeInTheDocument();
  });

  it('skal ikke måtte oppgi beløp som skal tilbakekreves når beløpet ikke er i behold', () => {
    renderWithIntlAndReduxForm(<BelopetMottattIGodTroFormPanel readOnly={false} erBelopetIBehold={false} />, {
      messages,
    });

    expect(screen.queryByRole('textbox', { name: 'Angi beløp som skal tilbakekreves' })).not.toBeInTheDocument();
  });
});
