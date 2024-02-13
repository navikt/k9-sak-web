import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import { reduxForm } from 'redux-form';
import messages from '../../../i18n/nb_NO.json';
import ForeldetFormPanel from './ForeldetFormPanel';

describe('<ForeldetFormPanel>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);

  it('skal rendre komponent korrekt', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <ForeldetFormPanel />
      </MockForm>,
      { messages },
    );
    expect(screen.getByText('Vurder om perioden er foreldet')).toBeInTheDocument();
  });
});
