import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { CheckboxField } from '@fpsak-frontend/form';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import { InntektstabellPanelImpl } from './InntektstabellPanel';

const { OVERSTYRING_AV_BEREGNINGSGRUNNLAG } = avklaringsbehovCodes;

describe('<InntektstabellPanel>', () => {
  it('skal vise checkbox for overstyring', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        fieldArrayID="dummyId"
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        avklaringsbehov={[]}
        readOnly={false}
        erOverstyrt={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
  });

  it('skal vise checkbox for overstyring for saksbehandler når overstyrt', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        fieldArrayID="dummyId"
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre={false}
        avklaringsbehov={[]}
        readOnly={false}
        erOverstyrt
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
  });

  it('checkbox skal vere readOnly når man har overstyring aksjonspunkt', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        fieldArrayID="dummyId"
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        avklaringsbehov={[{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG, kodeverk: '' }, status: { kode: 'OPPR' } }]}
        readOnly={false}
        erOverstyrt={false}
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const checkbox = wrapper.find(CheckboxField);
    expect(checkbox).has.length(1);
    expect(checkbox.first().prop('readOnly')).to.equal(true);
  });
});
