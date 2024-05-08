import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import CalendarOverlay from './CalendarOverlay';

describe('<CalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    renderWithIntl(
      <CalendarOverlay
        onDayChange={vi.fn()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={vi.fn()}
        value="21.08.2017"
        numberOfMonths={1}
        disabled
      />,
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise overlay', () => {
    renderWithIntl(
      <CalendarOverlay
        onDayChange={vi.fn()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={vi.fn()}
        value="21.08.2017"
      />,
    );

    expect(screen.getByText('man')).toBeInTheDocument();
    expect(screen.getByText('tor')).toBeInTheDocument();
    expect(screen.getByText('søn')).toBeInTheDocument();
    expect(screen.getByText('August 2017')).toBeInTheDocument();
  });

  it('skal ikke sette dato når denne ikke er korrekt', () => {
    const onDayChangeCallback = vi.fn();
    const date = '21.sd.2017';
    renderWithIntl(
      <CalendarOverlay
        onDayChange={onDayChangeCallback}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={vi.fn()}
        value={date}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByText(/2017/i)).not.toBeInTheDocument();
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', async () => {
    const onCloseCallback = vi.fn();
    const elementIsCalendarButton = () => false;
    renderWithIntl(
      <CalendarOverlay
        onDayChange={vi.fn()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={elementIsCalendarButton}
        value="21.08.2017"
        onClose={onCloseCallback}
      />,
    );
    expect(screen.getByText('August 2017')).toBeInTheDocument();

    await act(async () => {
      fireEvent.blur(screen.getByRole('link'));
    });
    expect(onCloseCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal kjøre callback når en trykker escape-knappen', async () => {
    const onCloseCallback = vi.fn();
    renderWithIntl(
      <CalendarOverlay
        onDayChange={vi.fn()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={vi.fn()}
        value="21.08.2017"
        onClose={onCloseCallback}
      />,
    );

    await userEvent.keyboard('{Escape}');

    expect(onCloseCallback.mock.calls.length).toBeGreaterThan(0);
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', async () => {
    const onCloseCallback = vi.fn();
    renderWithIntl(
      <CalendarOverlay
        onDayChange={vi.fn()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={vi.fn()}
        value="21.08.2017"
        onClose={onCloseCallback}
      />,
    );

    await userEvent.keyboard('{Enter}');

    expect(onCloseCallback.mock.calls.length).toBe(0);
  });
});
