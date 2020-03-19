import React from 'react';
import { shallow } from 'enzyme';
import { TableColumn } from '@fpsak-frontend/shared-components/index';
import { expect } from 'chai';
import UttakTabell from './UttakTabell';
import { UtfallEnum } from './dto/Utfall';
import { InnvilgetÅrsakEnum } from './dto/InnvilgetÅrsakType';

describe('<UttakTabell>', () => {
  it('rendrer en tabell med en rad og riktig antall kolonner', () => {
    const wrapper = shallow(
      <UttakTabell
        periode={{
          fom: '2020-01-01',
          tom: '2020-02-01',
          utfall: UtfallEnum.INNVILGET,
          grad: 100,
          årsaker: [{ årsakstype: InnvilgetÅrsakEnum.AVKORTET_MOT_INNTEKT }],
          behandlingId: '123',
        }}
        person={{
          kjønn: 'K',
          navn: {
            fornavn: 'A',
            etternavn: 'N',
          },
        }}
      />,
    );

    const kolonner = wrapper.find(TableColumn);

    expect(kolonner).to.have.length(5);
  });
});
