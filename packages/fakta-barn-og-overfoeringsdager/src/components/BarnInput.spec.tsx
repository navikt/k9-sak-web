import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Panel from 'nav-frontend-paneler';
import BarnInput from './BarnInput';
import { BarnEnum } from '../types/Barn';
import FastBreddeAligner from './FastBreddeAligner';

it('rendrer et panel', () => {
  const wrapper = shallow(
    <BarnInput barntype={BarnEnum.HENTET_AUTOMATISK} readOnly={false} namePrefix="test" visning={<>hei</>} />,
  );

  expect(wrapper.find(Panel)).to.have.length(1);
  expect(wrapper.find(FastBreddeAligner)).to.have.length(1);
});
