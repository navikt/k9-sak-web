import { shallow } from 'enzyme';
import React from 'react';
import FastBreddeAligner, { Kolonne } from './FastBreddeAligner';

it('rendrer alle kolonner med gitt content', () => {
  const content1 = 'kolonne_1';
  const content2 = 'kolonne_2';
  const kolonner = [
    {
      width: '100px',
      id: '1',
      content: content1,
    },
    {
      width: '200px',
      id: '2',
      content: content2,
    },
  ];

  const wrapper = shallow(<FastBreddeAligner kolonner={kolonner} />);
  const renderedKolonner = wrapper.find(Kolonne);

  expect(renderedKolonner).toHaveLength(2);
  expect(renderedKolonner.filterWhere(kol => kol.text() === content1)).toHaveLength(1);
  expect(renderedKolonner.filterWhere(kol => kol.text() === content2)).toHaveLength(1);
});
