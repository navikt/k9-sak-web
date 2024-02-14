import { shallow } from 'enzyme';
import moment from 'moment';
import { Input } from 'nav-frontend-skjema';
import React from 'react';
import sinon from 'sinon';

import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PeriodCalendarOverlay from './PeriodCalendarOverlay';
import Periodpicker from './Periodpicker';

describe('<Periodpicker>', () => {
  it('skal vise periodefelt med angitt periode', () => {
    const { container } = render(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017' } }}
        toDate={{ input: { value: '31.10.2017' } }}
      />,
    );

    expect(screen.getByPlaceholderText('dd.mm.åååå - dd.mm.åååå')).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBe(1);
    expect(container.getElementsByClassName('calendarToggleButton').length).toBe(1);
  });

  it.skip('skal vise dato-velger ved trykk på knapp', () => {
    const { container } = render(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017' } }}
        toDate={{ input: { value: '31.10.2017' } }}
      />,
    );

    userEvent.click(screen.getByRole('button'));

    // const button = wrapper.find(CalendarToggleButton);
    // button.prop('toggleShowCalendar')();
    // wrapper.update();

    // const overlay = wrapper.find(PeriodCalendarOverlay);
    // expect(overlay).toHaveLength(1);
    // expect(overlay.prop('startDate')).toEqual(moment('30.08.2017', DDMMYYYY_DATE_FORMAT).toDate());
    // expect(overlay.prop('endDate')).toEqual(moment('31.10.2017', DDMMYYYY_DATE_FORMAT).toDate());
  });

  it('skal lage periode med lik start- og sluttdato når en velger dato og det ikke finnes noe fra før', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '', onChange: onChangeCallback } }}
        toDate={{ input: { value: '', onChange: onChangeCallback } }}
      />,
    );

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.08.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const inputField = wrapper.find(Input);
    expect(inputField.prop('value')).toEqual('30.08.2017 - 30.08.2017');
  });

  it('skal lage periode med ny startdato når en velger dato etter nåværende periode', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017', onChange: onChangeCallback } }}
        toDate={{ input: { value: '30.10.2017', onChange: onChangeCallback } }}
      />,
    );

    const inputField = wrapper.find(Input);
    const ref = inputField.prop('inputRef') as (params: any) => void;
    ref({ focus: sinon.spy() });
    wrapper.update();

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.07.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const updatedInputField = wrapper.find(Input);
    expect(updatedInputField.prop('value')).toEqual('30.07.2017 - 30.10.2017');
  });

  it('skal lage periode med ny sluttdato når en velger dato etter nåværende periode', () => {
    const onChangeCallback = sinon.spy();
    const wrapper = shallow(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017', onChange: onChangeCallback } }}
        toDate={{ input: { value: '30.10.2017', onChange: onChangeCallback } }}
      />,
    );

    const inputField = wrapper.find(Input);
    const ref = inputField.prop('inputRef') as (params: any) => void;
    ref({ focus: sinon.spy() });
    wrapper.update();

    wrapper.setState({ showCalendar: true });

    const overlay = wrapper.find(PeriodCalendarOverlay);
    overlay.prop('onDayChange')(moment('30.11.2017', DDMMYYYY_DATE_FORMAT).toDate());
    wrapper.update();

    const updatedInputField = wrapper.find(Input);
    expect(updatedInputField.prop('value')).toEqual('30.08.2017 - 30.11.2017');
  });
});
