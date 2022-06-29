import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { SkjeringspunktOgStatusPanelImpl } from './SkjeringspunktOgStatusPanel';

const skjeringstidspunktDato = '2017-12-12';
const aktivitetstatusList = [aktivitetStatus.ARBEIDSTAKER, aktivitetStatus.FRILANSER];

const getKodeverknavn = (kode, kodeverk) => {
  if (kode === aktivitetStatus.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  if (kode === aktivitetStatus.FRILANSER) {
    return 'Frilanser';
  }

  return '';
};

describe('<SkjeringspunktOgStatusPanel>', () => {
  it('Skal teste at komponenten renderer riktig skjeringstidspunkt', () => {
    const wrapper = shallow(
      <SkjeringspunktOgStatusPanelImpl
        aktivitetStatusList={aktivitetstatusList}
        skjeringstidspunktDato={skjeringstidspunktDato}
        getKodeverknavn={getKodeverknavn}
      />,
    );

    const messages = wrapper.find('MemoizedFormattedMessage');
    expect(messages).to.be.lengthOf(1);
    expect(messages.first().props().id).to.equal('Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning');
    const dato = wrapper.find('DateLabel');
    expect(dato.first().props().dateString).to.equal(skjeringstidspunktDato);
  });
});
