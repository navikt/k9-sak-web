import React from 'react';
import { shallow } from 'enzyme';

import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';

import TilbakekrevingAktivitetTabell from './TilbakekrevingAktivitetTabell';

describe('<TilbakekrevingAktivitetTabell>', () => {
  it('skal ikke vise tabell når ytelselisten er tom', () => {
    const wrapper = shallow(<TilbakekrevingAktivitetTabell ytelser={[]} />);

    expect(wrapper.find(Table)).toHaveLength(0);
  });

  it('skal vise tabell med to rader når det finnes to ytelser', () => {
    const wrapper = shallow(
      <TilbakekrevingAktivitetTabell
        ytelser={[
          {
            aktivitet: 'test',
            belop: 1,
          },
          {
            aktivitet: 'test2',
            belop: 2,
          },
        ]}
      />,
    );

    const table = wrapper.find(Table);
    expect(table).toHaveLength(1);

    const tableRow = wrapper.find(TableRow);
    expect(tableRow).toHaveLength(2);

    const tableCol1 = tableRow.first().find(TableColumn);
    expect(tableCol1).toHaveLength(2);
    expect(tableCol1.first().childAt(0).childAt(0).text()).toEqual('test');
    expect(tableCol1.last().childAt(0).childAt(0).text()).toEqual('1');
    const tableCol2 = tableRow.last().find(TableColumn);
    expect(tableCol2).toHaveLength(2);
    expect(tableCol2.first().childAt(0).childAt(0).text()).toEqual('test2');
    expect(tableCol2.last().childAt(0).childAt(0).text()).toEqual('2');
  });
});
