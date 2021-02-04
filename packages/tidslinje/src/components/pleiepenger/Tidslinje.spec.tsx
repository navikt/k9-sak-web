import React from 'react';
import { shallow } from 'enzyme';
import Timeline from 'react-visjs-timeline';

import Tidslinje from './Tidslinje';
import TidslinjeRad from './types/TidslinjeRad';

describe('<Tidslinje>', () => {
  it('konverterer props til Timeline config', () => {
    const rader: TidslinjeRad<unknown>[] = [
      {
        ikon: {
          src: null,
          imageText: '',
          title: '',
        },
        id: '1',
        perioder: [
          {
            id: '1-1',
            fom: '2019-10-10',
            tom: '2019-11-10',
            hoverText: '',
            periodeinfo: {},
          },
          {
            id: '1-2',
            fom: '2017-10-10',
            tom: '2017-11-10',
            hoverText: '',
            periodeinfo: {},
          },
        ],
      },
      {
        ikon: {
          src: null,
          imageText: '',
          title: '',
        },
        id: '2',
        perioder: [
          {
            id: '2-1',
            fom: '2018-10-10',
            tom: '2018-11-10',
            hoverText: '',
            periodeinfo: {},
          },
        ],
      },
    ];
    const wrapper = shallow(
      <Tidslinje
        rader={rader}
        velgPeriode={() => {
          return undefined;
        }}
      />,
    );

    const timeline = wrapper.find(Timeline);
    expect(timeline).toHaveLength(1);

    const items = timeline.prop('items');
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe('1-2');
    expect(items[1].id).toBe('2-1');
    expect(items[2].id).toBe('1-1');

    const groups = timeline.prop('groups');
    expect(groups).toEqual([
      { id: '1', content: '' },
      { id: '2', content: '' },
    ]);
  });
});
