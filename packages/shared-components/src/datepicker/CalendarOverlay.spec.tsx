import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import CalendarOverlay from './CalendarOverlay';

describe('<CalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    renderWithIntl(
      <CalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
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
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={sinon.spy()}
        value="21.08.2017"
      />,
    );

    expect(screen.getByText('man')).toBeInTheDocument();
    expect(screen.getByText('tor')).toBeInTheDocument();
    expect(screen.getByText('søn')).toBeInTheDocument();
    expect(screen.getByText('August 2017')).toBeInTheDocument();
  });

  it('skal ikke sette dato når denne ikke er korrekt', () => {
    const onDayChangeCallback = sinon.spy();
    const date = '21.sd.2017';
    renderWithIntl(
      <CalendarOverlay
        onDayChange={onDayChangeCallback}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={sinon.spy()}
        value={date}
        onClose={sinon.spy()}
      />,
    );

    expect(screen.queryByText(/2017/i)).not.toBeInTheDocument();
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', async () => {
    const onCloseCallback = sinon.spy();
    const elementIsCalendarButton = () => false;
    renderWithIntl(
      <CalendarOverlay
        onDayChange={sinon.spy()}
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
    expect(onCloseCallback.called).toBe(true);
  });

  it('skal kjøre callback når en trykker escape-knappen', async () => {
    const onCloseCallback = sinon.spy();
    renderWithIntl(
      <CalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={sinon.spy()}
        value="21.08.2017"
        onClose={onCloseCallback}
      />,
    );

    await userEvent.keyboard('{Escape}');

    expect(onCloseCallback.called).toBe(true);
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', async () => {
    const onCloseCallback = sinon.spy();
    renderWithIntl(
      <CalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={sinon.spy()}
        value="21.08.2017"
        onClose={onCloseCallback}
      />,
    );

    await userEvent.keyboard('{Enter}');

    expect(onCloseCallback.called).toBe(false);
  });
});
