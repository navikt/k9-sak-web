import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import React from 'react';
import sinon from 'sinon';
import PeriodCalendarOverlay from './PeriodCalendarOverlay';

describe('<PeriodCalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment().toDate()}
        endDate={moment().toDate()}
        disabled
      />,
    );

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise overlay', () => {
    const startDate = moment('2017-08-31').toDate();
    const endDate = moment('2018-08-31').toDate();
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={startDate}
        endDate={endDate}
      />,
    );

    expect(screen.getAllByText('man').length).toBeGreaterThan(0);
    expect(screen.getAllByText('tor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('søn').length).toBeGreaterThan(0);
    expect(screen.getByText('August 2018')).toBeInTheDocument();
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', async () => {
    const onCloseCallback = sinon.spy();
    const elementIsCalendarButton = () => false;
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={elementIsCalendarButton}
        startDate={moment('2017-08-31').toDate()}
        endDate={moment('2018-08-31').toDate()}
        onClose={onCloseCallback}
      />,
    );

    expect(screen.getByText('August 2018')).toBeInTheDocument();

    await act(async () => {
      fireEvent.blur(screen.getByRole('link'));
    });
    expect(onCloseCallback.called).toBe(true);
  });

  it('skal kjøre callback når en trykker escape-knappen', async () => {
    const onCloseCallback = sinon.spy();
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment('2017-08-31').toDate()}
        endDate={moment('2018-08-31').toDate()}
        onClose={onCloseCallback}
      />,
    );

    await userEvent.keyboard('{Escape}');

    expect(onCloseCallback.called).toBe(true);
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', async () => {
    const onCloseCallback = sinon.spy();
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment('2017-08-31').toDate()}
        endDate={moment('2018-08-31').toDate()}
        onClose={onCloseCallback}
      />,
    );

    await userEvent.keyboard('{Enter}');

    expect(onCloseCallback.called).toBe(false);
  });

  it('skal sette input-dato når ingen dager er disabled', async () => {
    const onDayChangeCallback = sinon.spy();
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={onDayChangeCallback}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment('2017-08-31').toDate()}
        endDate={moment('2018-08-31').toDate()}
        onClose={sinon.spy()}
      />,
    );

    const date = '2018-08-01T10:00:00.000Z';

    await act(async () => {
      await userEvent.click(screen.getByRole('gridcell', { name: 'Wed Aug 01 2018' }));
    });
    expect(onDayChangeCallback.called).toBe(true);
    expect(onDayChangeCallback.getCalls()).toHaveLength(1);
    const args1 = onDayChangeCallback.getCalls()[0].args;
    expect(args1).toHaveLength(1);
    const dateToCompare1 = new Date(args1[0]);
    dateToCompare1.setHours(0, 0, 0, 0);
    const dateToCompare2 = new Date(date);
    dateToCompare2.setHours(0, 0, 0, 0);
    expect(dateToCompare1.getTime()).toEqual(dateToCompare2.getTime());
  });

  it('skal sette input-dato når denne er innenfor det gyldige intervallet', async () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: new Date('2018-01-05'),
      after: new Date('2018-08-31'),
    };
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={onDayChangeCallback}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment('2017-08-31').toDate()}
        endDate={moment('2018-08-31').toDate()}
        disabledDays={disabledDays}
        onClose={sinon.spy()}
      />,
    );

    const date = '2018-08-01T10:00:00.000Z';

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Previous Month' }));
    });
    await act(async () => {
      await userEvent.click(screen.getByRole('gridcell', { name: 'Wed Aug 01 2018' }));
    });

    expect(onDayChangeCallback.called).toBe(true);
    expect(onDayChangeCallback.getCalls()).toHaveLength(1);
    const args1 = onDayChangeCallback.getCalls()[0].args;
    expect(args1).toHaveLength(1);
    const dateToCompare1 = new Date(args1[0]);
    dateToCompare1.setHours(0, 0, 0, 0);
    const dateToCompare2 = new Date(date);
    dateToCompare2.setHours(0, 0, 0, 0);
    expect(dateToCompare1.getTime()).toEqual(dateToCompare2.getTime());
  });

  it('skal ikke sette input-dato når denne er utenfor startdato i intervallet', async () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: new Date('2018-01-05'),
      after: new Date('2018-01-10'),
    };
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={onDayChangeCallback}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment('2018-08-01').toDate()}
        endDate={moment('2018-08-31').toDate()}
        disabledDays={disabledDays}
        onClose={sinon.spy()}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Previous Month' }));
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('gridcell', { name: 'Tue Jul 31 2018' }));
    });

    expect(onDayChangeCallback.called).toBe(false);
  });

  it('skal ikke sette input-dato når denne er utenfor sluttdato i intervallet', async () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: new Date('2018-01-05'),
      after: new Date('2018-01-10'),
    };
    renderWithIntl(
      <PeriodCalendarOverlay
        onDayChange={onDayChangeCallback}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={moment('2017-08-31').toDate()}
        endDate={moment('2018-08-31').toDate()}
        disabledDays={disabledDays}
        onClose={sinon.spy()}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Next Month' }));
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('gridcell', { name: 'Sat Sep 01 2018' }));
    });

    expect(onDayChangeCallback.called).toBe(false);
  });
});
