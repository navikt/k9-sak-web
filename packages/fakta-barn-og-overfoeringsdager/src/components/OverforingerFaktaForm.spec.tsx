import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import FormValues from '../types/FormValues';
import { OverforingerFaktaForm } from './OverforingerFaktaForm';

describe('<OverforingerFaktaForm>', () => {
  const formValues: FormValues = {
    fordelingFår: [],
    fordelingGir: [],
    koronaoverføringFår: [],
    koronaoverføringGir: [],
    overføringFår: [],
    overføringGir: [],
  };

  it('rendrer overføringer seksjon', () => {
    renderWithIntl(
      <OverforingerFaktaForm
        {...reduxFormPropsMock}
        formValues={formValues}
        rammevedtak={[]}
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByText('Overføringer og fordelinger')).toBeInTheDocument();
  });
});
