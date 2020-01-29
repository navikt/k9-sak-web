import React from 'react';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import Image from '@fpsak-frontend/shared-components/src/Image';
// eslint-disable-next-line import/extensions
import Kjønnkode from '@k9-frontend/types/src/Kjønnkode';
import TimeLineSoker from './TimeLineSoker';

describe('<TimeLineSoker>', () => {
  it('skal teste at TimeLineSoker viser korrekte bilder för korrekte soker', () => {
    const wrapper = mountWithIntl(
      <TimeLineSoker hovedsokerKjonnKode={Kjønnkode.KVINNE} medsokerKjonnKode={Kjønnkode.MANN} />,
    );
    const rows = wrapper.find('Row');
    expect(rows).to.have.length(2);
    expect(
      rows
        .find(Image)
        .at(0)
        .props().title,
    ).to.have.length.above(3);
    expect(
      rows
        .find(Image)
        .at(1)
        .props().title,
    ).to.have.length.above(3);
  });
});
