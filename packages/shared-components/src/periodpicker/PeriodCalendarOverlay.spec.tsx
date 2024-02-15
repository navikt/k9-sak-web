import React from 'react';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import sinon from 'sinon';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import PeriodCalendarOverlay from './PeriodCalendarOverlay';

describe('<PeriodCalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    const wrapper = shallowWithIntl(
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

    expect(wrapper.find(DayPicker)).toHaveLength(0);
  });

  it('skal vise overlay', () => {
    const startDate = moment('2017-08-31').toDate();
    const endDate = moment('2018-08-31').toDate();
    const wrapper = shallowWithIntl(
      <PeriodCalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        elementIsCalendarButton={sinon.spy()}
        startDate={startDate}
        endDate={endDate}
      />,
    );

    const daypicker = wrapper.find(DayPicker);
    expect(daypicker).toHaveLength(1);
    expect(daypicker.prop('months')).toEqual([
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]);
    expect(daypicker.prop('weekdaysLong')).toEqual([
      'søndag',
      'mandag',
      'tirsdag',
      'onsdag',
      'torsdag',
      'fredag',
      'lørdag',
    ]);
    expect(daypicker.prop('weekdaysShort')).toEqual(['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør']);
    expect(daypicker.prop('firstDayOfWeek')).toEqual(1);
    expect(daypicker.prop('selectedDays')).toEqual([
      {
        from: startDate,
        to: endDate,
      },
    ]);
    expect(daypicker.prop('initialMonth')).toEqual(endDate);
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', () => {
    const onCloseCallback = () => {
      expect(true).toBe(true);
    };
    const elementIsCalendarButton = () => false;
    const wrapper = shallowWithIntl(
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

    wrapper.find('div').prop('onBlur')({} as React.FocusEvent);
  });

  it('skal kjøre callback når en trykker escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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

    wrapper.find('div').prop('onKeyDown')({ keyCode: 27 } as any);

    expect(onCloseCallback.called).toBe(true);
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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

    wrapper.find('div').prop('onKeyDown')({ keyCode: 20 } as any);

    expect(onCloseCallback.called).toBe(false);
  });

  it('skal sette input-dato når ingen dager er disabled', () => {
    const onDayChangeCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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

    const date = '2018-01-10';
    // @ts-ignore
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).toBe(true);
    expect(onDayChangeCallback.getCalls()).toHaveLength(1);
    const args1 = onDayChangeCallback.getCalls()[0].args;
    expect(args1).toHaveLength(1);
    expect(args1[0]).toEqual(date);
  });

  it('skal sette input-dato når denne er innenfor det gyldige intervallet', () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: new Date('2018-01-05'),
      after: new Date('2018-01-10'),
    };
    const wrapper = shallowWithIntl(
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

    const date = '2018-01-10';
    // @ts-ignore
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).toBe(true);
    expect(onDayChangeCallback.getCalls()).toHaveLength(1);
    const args1 = onDayChangeCallback.getCalls()[0].args;
    expect(args1).toHaveLength(1);
    expect(args1[0]).toEqual(date);
  });

  it('skal ikke sette input-dato når denne er utenfor startdato i intervallet', () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: new Date('2018-01-05'),
      after: new Date('2018-01-10'),
    };
    const wrapper = shallowWithIntl(
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

    const date = '2018-01-01';
    // @ts-ignore
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).toBe(false);
  });

  it('skal ikke sette input-dato når denne er utenfor sluttdato i intervallet', () => {
    const onDayChangeCallback = sinon.spy();
    const disabledDays = {
      before: new Date('2018-01-05'),
      after: new Date('2018-01-10'),
    };
    const wrapper = shallowWithIntl(
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

    const date = '2018-01-11';
    // @ts-ignore
    wrapper.find(DayPicker).prop('onDayClick')(date);

    expect(onDayChangeCallback.called).toBe(false);
  });
});
