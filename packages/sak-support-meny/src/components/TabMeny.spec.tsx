import SendMeldingSvg from '@fpsak-frontend/assets/images/email-send-1.svg';
import HistorikkSvg from '@fpsak-frontend/assets/images/synchronize-time.svg';
import { FlexColumn } from '@fpsak-frontend/shared-components';
import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
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

    render(<TabMeny tabs={tabs} onClick={vi.fn} />);
    expect(screen.getAllByTestId('TabMenyKnapp')[0]).not.toBeDisabled();
    expect(screen.getAllByTestId('TabMenyKnapp')[1]).toBeDisabled();
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
