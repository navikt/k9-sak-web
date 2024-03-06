import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';

it('skal vise to radioknapper', () => {
  renderWithIntlAndReduxForm(
    <ArbeidsforholdRadioknapper.WrappedComponent intl={intlMock} formName="" behandlingId={1} behandlingVersjon={1} />,
    { messages },
  );

  expect(screen.getByRole('radio', { name: 'Ja' })).not.toBeDisabled();
  expect(screen.getByRole('radio', { name: 'Nei, fortsett behandling' })).not.toBeDisabled();
});
