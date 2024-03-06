import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
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

  it('skal vise dato-velger ved trykk på knapp', async () => {
    const { container } = render(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017' } }}
        toDate={{ input: { value: '31.10.2017' } }}
      />,
    );

    await userEvent.click(screen.getByRole('button'));
    expect(container.getElementsByClassName('calendarRoot').length).toBe(1);
    expect(screen.getByDisplayValue('30.08.2017 - 31.10.2017')).toBeInTheDocument();
  });

  it('skal lage periode med ny startdato når en velger dato etter nåværende periode', async () => {
    const onChangeCallback = sinon.spy();
    render(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017', onChange: onChangeCallback } }}
        toDate={{ input: { value: '30.10.2017', onChange: onChangeCallback } }}
      />,
    );

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button', { name: 'Previous Month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous Month' }));
    await userEvent.click(screen.getByRole('button', { name: 'Previous Month' }));
    await userEvent.click(screen.getByRole('gridcell', { name: 'Sun Jul 30 2017' }));
    expect(screen.getByDisplayValue('30.07.2017 - 30.10.2017')).toBeInTheDocument();
  });

  it('skal lage periode med ny sluttdato når en velger dato etter nåværende periode', async () => {
    const onChangeCallback = sinon.spy();
    render(
      <Periodpicker
        names={['fromDate', 'toDate']}
        // @ts-ignore
        fromDate={{ input: { value: '30.08.2017', onChange: onChangeCallback } }}
        toDate={{ input: { value: '30.10.2017', onChange: onChangeCallback } }}
      />,
    );

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('gridcell', { name: 'Thu Nov 30 2017' }));
    expect(screen.getByDisplayValue('30.08.2017 - 30.11.2017')).toBeInTheDocument();
  });
});
