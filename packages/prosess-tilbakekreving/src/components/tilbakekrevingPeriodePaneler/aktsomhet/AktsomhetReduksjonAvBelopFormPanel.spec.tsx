import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { Normaltekst } from 'nav-frontend-typografi';
import { InputField, RadioGroupField, SelectField } from '@fpsak-frontend/form';

import Aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetReduksjonAvBelopFormPanel from './AktsomhetReduksjonAvBelopFormPanel';

describe('<AktsomhetReduksjonAvBelopFormPanel>', () => {
  it('skal måtte angi andel som skal tilbakekreves når en har grunner til reduksjon og færre enn to ytelser', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
    );

    const select = wrapper.find(SelectField);
    expect(select).toHaveLength(1);
    expect(select.prop('name')).toEqual('andelSomTilbakekreves');
    // @ts-ignore litt usikker på denne, men tror denne trengs fordi fpsak-frontend/form ikkje er fullstendig konvertert til typescript
    expect(select.prop('selectValues').map(v => v.key)).toEqual(['30', '50', '70', 'Egendefinert']);

    expect(wrapper.find(InputField)).toHaveLength(0);
  });

  it('skal få informasjon om at det ikke skal tillegges renter når en har grunner til reduksjon og grad grovt uaktsom', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
    );

    const select = wrapper.find(FormattedMessage);
    expect(select).toHaveLength(4);
    expect(select.at(2).prop('id')).toEqual('AktsomhetReduksjonAvBelopFormPanel.SkalTilleggesRenter');

    expect(wrapper.find(InputField)).toHaveLength(0);
  });

  it('skal ikke få informasjon om at det ikke skal tillegges renter når en har grunner til reduksjon og grad simpel uaktsom', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
    );

    expect(wrapper.find(FormattedMessage)).toHaveLength(2);
    expect(wrapper.find(InputField)).toHaveLength(0);
  });

  it('skal måtte angi beløp som skal tilbakekreves når en har grunner til reduksjon og mer enn en ytelse', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={100}
      />,
    );

    expect(wrapper.find(InputField)).toHaveLength(1);
    expect(wrapper.find(SelectField)).toHaveLength(0);
  });

  it('skal vise andel som skal tilbakekreves når en ikke har grunner til reduksjon og færre enn to ytelser', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse={false}
        feilutbetalingBelop={100}
      />,
    );

    const message = wrapper.find(FormattedMessage);
    expect(message).toHaveLength(2);
    expect(message.at(1).prop('id')).toEqual('AktsomhetReduksjonAvBelopFormPanel.andelSomTilbakekreves');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).toHaveLength(1);
    expect(normaltekst.childAt(0).text()).toEqual('100%');

    expect(wrapper.find(InputField)).toHaveLength(0);
    expect(wrapper.find(SelectField)).toHaveLength(0);
  });

  it('skal vise andel som skal tilbakekreves når en ikke har grunner til reduksjon og mer enn en ytelser', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={10023}
      />,
    );

    const message = wrapper.find(FormattedMessage);
    expect(message).toHaveLength(2);
    expect(message.at(1).prop('id')).toEqual('AktsomhetReduksjonAvBelopFormPanel.BelopSomSkalTilbakekreves');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).toHaveLength(1);
    expect(normaltekst.childAt(0).text()).toEqual('10 023');

    expect(wrapper.find(InputField)).toHaveLength(0);
    expect(wrapper.find(SelectField)).toHaveLength(0);
  });

  it('skal vise radioknapper for valg om det skal tillegges renter når en ikke har grunner til reduksjon og grad grovt uaktsomt', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.GROVT_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={10023}
      />,
    );

    expect(wrapper.find(RadioGroupField)).toHaveLength(2);
  });

  it('skal ikke vise radioknapper for valg om det skal tillegges renter når en ikke har grunner til reduksjon og grad simpelt uaktsomt', () => {
    const wrapper = shallow(
      <AktsomhetReduksjonAvBelopFormPanel
        harGrunnerTilReduksjon={false}
        readOnly={false}
        handletUaktsomhetGrad={Aktsomhet.SIMPEL_UAKTSOM}
        harMerEnnEnYtelse
        feilutbetalingBelop={10023}
      />,
    );

    expect(wrapper.find(RadioGroupField)).toHaveLength(1);
  });
});
