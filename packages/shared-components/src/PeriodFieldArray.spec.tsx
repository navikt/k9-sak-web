import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { metaMock, MockFields } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import PeriodFieldArray from './PeriodFieldArray';

const readOnly = false;

describe('<PeriodFieldArray>', () => {
  it('skal vise en rad og knapp for å legge til periode', () => {
    const fields = new MockFields('perioder', 1);
    renderWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Legg til periode/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Legg til periode' })).toBeInTheDocument();
  });

  it('skal vise to rader der kun rad nummer to har sletteknapp', () => {
    const fields = new MockFields('perioder', 2);

    const { container } = renderWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {(_periodeElementFieldId, index, getRemoveButton: () => React.ReactNode) => (
          <div key={index} id={`id_${index}`}>
            test
            {getRemoveButton()}
          </div>
        )}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(screen.getAllByText('test')).toHaveLength(2);
    expect(container.getElementsByClassName('buttonRemove')).toHaveLength(1);
  });

  it('skal legge til periode ved klikk på legg til periode', async () => {
    const fields = new MockFields('perioder', 1);

    renderWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(fields.length).toBe(1);
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Legg til periode/i }));
    });
    expect(fields.length).toBe(2);
  });

  it('skal slette periode ved klikk på sletteknapp', async () => {
    const fields = new MockFields('perioder', 2);

    renderWithIntl(
      <PeriodFieldArray.WrappedComponent intl={intlMock} fields={fields} meta={metaMock} readOnly={readOnly}>
        {(_periodeElementFieldId, index, getRemoveButton: () => React.ReactNode) => (
          <div key={index} id={`id_${index}`}>
            test
            {getRemoveButton()}
          </div>
        )}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(fields.length).toBe(2);
    await act(async () => {
      await userEvent.click(screen.getByTestId('removeButton'));
    });
    expect(fields.length).toBe(1);
  });

  it('skal ikke vise knapp for å legge til rad', () => {
    const fields = new MockFields('perioder', 1);

    renderWithIntl(
      <PeriodFieldArray.WrappedComponent
        intl={intlMock}
        fields={fields}
        shouldShowAddButton={false}
        readOnly={readOnly}
      >
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(screen.queryByTestId('removeButton')).not.toBeInTheDocument();
  });

  it('skal vise knapp for å legge til i steden for bildelenke', () => {
    const fields = new MockFields('perioder', 1);

    renderWithIntl(
      <PeriodFieldArray.WrappedComponent
        intl={intlMock}
        fields={fields}
        createAddButtonInsteadOfImageLink
        readOnly={readOnly}
      >
        {periodeElementFieldId => <span key={periodeElementFieldId}>test</span>}
      </PeriodFieldArray.WrappedComponent>,
    );

    expect(screen.getByRole('button', { name: /Legg til periode/i })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
