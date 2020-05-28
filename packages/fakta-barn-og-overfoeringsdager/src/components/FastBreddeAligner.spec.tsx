import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import FastBreddeAligner, { Kolonne } from './FastBreddeAligner';

it('rendrer alle kolonner med gitt content', () => {
  const content_1 = 'kolonne_1';
  const content_2 = 'kolonne_2';
  const kolonner = [
    {
      width: '100px',
      id: '1',
      content: content_1,
    },
    {
      width: '200px',
      id: '2',
      content: content_2,
    },
  ];

  const wrapper = shallow(<FastBreddeAligner kolonner={kolonner} />);
  const renderedKolonner = wrapper.find(Kolonne);

  expect(renderedKolonner).to.have.length(2);
  expect(renderedKolonner.filterWhere(kol => kol.text() === content_1)).to.have.length(1);
  expect(renderedKolonner.filterWhere(kol => kol.text() === content_2)).to.have.length(1);
});
