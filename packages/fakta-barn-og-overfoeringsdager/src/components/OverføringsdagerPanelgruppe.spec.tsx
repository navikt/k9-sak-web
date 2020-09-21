import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '../../i18n';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';
import { OverføringsretningEnum } from '../types/Overføring';
import OverføringsdagerPanel from './OverføringsdagerPanel';

describe('<OverføringsdagerPanelgruppe>', () => {
  it('Rendrer 3 OverføringsdagerPaneler med ', () => {
    const wrapper = shallowWithIntl(
      <OverføringsdagerPanelgruppe
        retning={OverføringsretningEnum.UT}
        koronaoverføringer={[]}
        fordelinger={[]}
        overføringer={[]}
        behandlingVersjon={1}
        behandlingId={1}
      />,
    );

    expect(wrapper.find(OverføringsdagerPanel)).to.have.length(3);
  });
});
