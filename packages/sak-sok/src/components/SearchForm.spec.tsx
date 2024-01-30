import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { reduxForm } from 'redux-form';
import sinon from 'sinon';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { SearchForm } from './SearchForm';

describe('<Search>', () => {
  it('skal ha et søkefelt og en søkeknapp', () => {
    const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);
    renderWithIntlAndReduxForm(
      <MockForm>
        <SearchForm intl={intlMock} searchString="" searchStarted {...reduxFormPropsMock} />{' '}
      </MockForm>,
      { messages },
    );
    expect(screen.getByLabelText('Saksnummer eller fødselsnummer/D-nummer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Laster' })).toBeInTheDocument();
  });

  it('skal utføre søk når en trykker på søkeknapp', async () => {
    const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);
    const onButtonClick = sinon.spy();

    renderWithIntlAndReduxForm(
      <MockForm>
        <SearchForm
          intl={intlMock}
          searchString="test"
          searchStarted={false}
          {...reduxFormPropsMock}
          handleSubmit={onButtonClick}
        />{' '}
      </MockForm>,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Søk' }));
    });
    expect(onButtonClick).toHaveProperty('callCount', 1);
  });
});
