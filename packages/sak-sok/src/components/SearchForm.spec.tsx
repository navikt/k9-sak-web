import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { SearchForm } from './SearchForm';

describe('<Search>', () => {
  it('skal ha et søkefelt og en søkeknapp', () => {
    renderWithIntlAndReduxForm(<SearchForm intl={intlMock} searchString="" searchStarted {...reduxFormPropsMock} />, {
      messages,
    });
    expect(screen.getByLabelText('Search.SaksnummerOrPersonId')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Søk' })).toBeInTheDocument();
  });

  it('skal utføre søk når en trykker på søkeknapp', async () => {
    const onButtonClick = vi.fn();

    renderWithIntlAndReduxForm(
      <SearchForm
        intl={intlMock}
        searchString="test"
        searchStarted={false}
        {...reduxFormPropsMock}
        handleSubmit={onButtonClick}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
    });
    expect(onButtonClick.mock.calls.length).toBe(1);
  });
});
