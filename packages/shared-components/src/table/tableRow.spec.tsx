import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import TableRow from './TableRow';
import TableColumn from './TableColumn';

describe('<TableRow>', () => {
  it('skal lage en rad og rendre children inne denne', () => {
    const mouseEventFunction = sinon.spy();
    const keyEventFunction = sinon.spy();
    const wrapper = shallow(
      <TableRow id={1} onMouseDown={mouseEventFunction} onKeyDown={keyEventFunction}>
        <TableColumn>{1}</TableColumn>
      </TableRow>,
    );

    expect(wrapper.find('tr')).toHaveLength(1);
    const col = wrapper.find('TableColumn');
    expect(col).toHaveLength(1);
    expect(col.childAt(0).text()).toEqual('1');
  });

  it('skal trigge events ved museklikk og tasteklikk', () => {
    const mouseEventFunction = sinon.spy();
    const keyEventFunction = sinon.spy();
    const wrapper = shallow(
      <TableRow id={1} onMouseDown={mouseEventFunction} onKeyDown={keyEventFunction}>
        <TableColumn>{1}</TableColumn>
      </TableRow>,
    );

    const row = wrapper.find('tr');
    row.simulate('mouseDown');
    expect(mouseEventFunction).toHaveProperty('callCount', 1);
    expect(keyEventFunction).toHaveProperty('callCount', 0);

    row.simulate('keyDown', { target: { tagName: 'TR' }, key: 'Enter', preventDefault: sinon.spy() });
    expect(keyEventFunction).toHaveProperty('callCount', 1);
    expect(mouseEventFunction).toHaveProperty('callCount', 1);
  });
});
