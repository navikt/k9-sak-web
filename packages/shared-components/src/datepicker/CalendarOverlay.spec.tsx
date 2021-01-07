import React from 'react';
import DayPicker from 'react-day-picker';
import sinon from 'sinon';

import { dateFormat } from '@fpsak-frontend/utils';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import CalendarOverlay from './CalendarOverlay';

describe('<CalendarOverlay>', () => {
  it('skal ikke vise overlay når disabled', () => {
    const wrapper = shallowWithIntl(
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

    expect(wrapper.find(DayPicker)).toHaveLength(0);
  });

  it('skal vise overlay', () => {
    const wrapper = shallowWithIntl(
      <CalendarOverlay
        onDayChange={sinon.spy()}
        className="test"
        dayPickerClassName="test"
        numberOfMonths={1}
        elementIsCalendarButton={sinon.spy()}
        value="21.08.2017"
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
    expect(dateFormat(daypicker.prop('selectedDays') as Date)).toEqual('21.08.2017');
  });

  it('skal ikke sette dato når denne ikke er korrekt', () => {
    const onDayChangeCallback = sinon.spy();
    const date = '21.sd.2017';
    const wrapper = shallowWithIntl(
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

    const daypicker = wrapper.find(DayPicker);
    expect(daypicker.prop('selectedDays')).toBeNull();
  });

  it('skal kjøre callback når overlay blir lukket og target er noe annet enn kalender eller kalenderknapp', () => {
    const onCloseCallback = () => {
      expect(true).toBe(true);
    };
    const elementIsCalendarButton = () => false;
    const wrapper = shallowWithIntl(
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

    wrapper.find('div').prop('onBlur')({} as React.FocusEvent);
  });

  it('skal kjøre callback når en trykker escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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

    wrapper.find('div').prop('onKeyDown')({ keyCode: 27 } as any);

    expect(onCloseCallback.called).toBe(true);
  });

  it('skal ikke kjøre callback når en trykker noe annet enn escape-knappen', () => {
    const onCloseCallback = sinon.spy();
    const wrapper = shallowWithIntl(
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

    wrapper.find('div').prop('onKeyDown')({ keyCode: 20 } as any);

    expect(onCloseCallback.called).toBe(false);
  });
});
