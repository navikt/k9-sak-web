import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import { DelOppPeriodeModalImpl, mapStateToPropsFactory } from './DelOppPeriodeModal';

describe('<DelOppPeriodeModal>', () => {
  const periodeData = {
    fom: '2018-01-01',
    tom: '2018-03-01',
  };
  const cancelEvent = vi.fn();

  it('skal rendre modal for del opp periode', () => {
    renderWithIntlAndReduxForm(
      <DelOppPeriodeModalImpl
        {...reduxFormPropsMock}
        periodeData={periodeData}
        showModal
        intl={intlMock}
        cancelEvent={cancelEvent}
      />,
      { messages },
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByText('Angi t.o.m. dato for første periode')).toHaveLength(2);
    expect(screen.getByText('01.01.2018 - 01.03.2018')).toBeInTheDocument();
  });

  it('skal lukke modal ved klikk på avbryt-knapp', async () => {
    renderWithIntlAndReduxForm(
      <DelOppPeriodeModalImpl
        {...reduxFormPropsMock}
        periodeData={periodeData}
        showModal
        intl={intlMock}
        cancelEvent={cancelEvent}
      />,
      { messages },
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Avbryt' }));
    });
    expect(cancelEvent.mock.calls.length).toBe(1);
  });

  it('skal validere ok når valgt dato er innenfor periode', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-10-20',
    };
    const result = validateAndOnSubmit.validate(values);
    expect(result).toEqual(null);
  });

  it('skal gi feilmelding når valgt dato er før periode', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-10-09',
    };
    const result = validateAndOnSubmit.validate(values);
    expect(result).toEqual({
      ForstePeriodeTomDato: [{ id: 'DelOppPeriodeModalImpl.DatoUtenforPeriode' }],
    });
  });

  it('skal gi feilmelding når valgt dato er etter periode', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-11-11',
    };
    const result = validateAndOnSubmit.validate(values);
    expect(result).toEqual({
      ForstePeriodeTomDato: [{ id: 'DelOppPeriodeModalImpl.DatoUtenforPeriode' }],
    });
  });

  it('skal transformere form-data før splitting av perioder', () => {
    const initialState = {};
    const ownProps = {
      periodeData: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
      splitPeriod: value => value,
    };

    const validateAndOnSubmit = mapStateToPropsFactory(initialState, ownProps)();

    const values = {
      ForstePeriodeTomDato: '2019-10-20',
    };
    const result = validateAndOnSubmit.onSubmit(values);
    expect(result).toEqual({
      forstePeriode: {
        fom: '2019-10-10',
        tom: '2019-10-20',
      },
      andrePeriode: {
        fom: '2019-10-21',
        tom: '2019-11-10',
      },
    });
  });
});
