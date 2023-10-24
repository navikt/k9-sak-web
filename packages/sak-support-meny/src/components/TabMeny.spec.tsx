import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ReactComponent as SendMeldingSvg } from '@fpsak-frontend/assets/images/email-send-1.svg';
import { ReactComponent as HistorikkSvg } from '@fpsak-frontend/assets/images/synchronize-time.svg';

import { FlexColumn } from '@fpsak-frontend/shared-components';

import TabMeny from './TabMeny';

describe('<TabMeny>', () => {
  it('skal vise tabs der Historikk er valgt og Send melding ikke er valgbar', () => {
    const tabs = [
      {
        getSvg: (isActive, isDisabled, props) => (
          <HistorikkSvg isActive={isActive} isDisabled={isDisabled} {...props} />
        ),
        tooltip: 'Historikk',
        isActive: true,
        isDisabled: false,
        antallUlesteNotater: 0,
      },
      {
        getSvg: (isActive, isDisabled, props) => (
          <SendMeldingSvg isActive={isActive} isDisabled={isDisabled} {...props} />
        ),
        tooltip: 'Send melding',
        isActive: false,
        isDisabled: true,
        antallUlesteNotater: 0,
      },
    ];

    const wrapper = shallow(<TabMeny tabs={tabs} onClick={() => undefined} />);

    const kolonne = wrapper.find(FlexColumn);
    expect(kolonne).toHaveLength(2);

    const knapp1 = kolonne.first().find('button');
    expect(knapp1.prop('className')).toEqual('button active');
    expect(knapp1.prop('data-tooltip')).toEqual('Historikk');
    expect(knapp1.prop('disabled')).toBe(false);

    const svgPlaceholder1 = knapp1.find('div');
    expect(svgPlaceholder1.prop('isActive')).toBe(true);
    expect(svgPlaceholder1.prop('isDisabled')).toBe(false);
    expect(svgPlaceholder1.prop('alt')).toEqual('Historikk');

    const knapp2 = kolonne.last().find('button');
    expect(knapp2.prop('className')).toEqual('button');
    expect(knapp2.prop('data-tooltip')).toEqual('Send melding');
    expect(knapp2.prop('disabled')).toBe(true);

    const svgPlaceholder2 = knapp2.find('div');
    expect(svgPlaceholder2.prop('isActive')).toBe(false);
    expect(svgPlaceholder2.prop('isDisabled')).toBe(true);
    expect(svgPlaceholder2.prop('alt')).toEqual('Send melding');
  });

  it('skal velge Send melding ved trykk på knapp', () => {
    const tabs = [
      {
        getSvg: (isActive, isDisabled, props) => (
          <HistorikkSvg isActive={isActive} isDisabled={isDisabled} {...props} />
        ),
        tooltip: 'Historikk',
        isActive: false,
        isDisabled: false,
        antallUlesteNotater: 0,
      },
      {
        getSvg: (isActive, isDisabled, props) => (
          <SendMeldingSvg isActive={isActive} isDisabled={isDisabled} {...props} />
        ),
        tooltip: 'Send melding',
        isActive: false,
        isDisabled: false,
        antallUlesteNotater: 0,
      },
    ];

    const onClick = sinon.spy();

    const wrapper = shallow(<TabMeny tabs={tabs} onClick={onClick} />);

    const kolonne = wrapper.find(FlexColumn);
    const knapp = kolonne.last().find('button');

    const knappFn = knapp.prop('onClick') as () => void;
    knappFn();

    expect(onClick.getCalls()).toHaveLength(1);
    const { args } = onClick.getCalls()[0];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual(1);
  });
});
