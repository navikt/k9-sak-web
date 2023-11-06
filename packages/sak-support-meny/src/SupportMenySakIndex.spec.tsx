import React from 'react';
import { shallow } from 'enzyme';

import SupportMenySakIndex from './SupportMenySakIndex';
import SupportTabs from './supportTabs';
import TabMeny from './components/TabMeny';

describe('<SupportMenySakIndex>', () => {
  it('skal lage tabs og sette Send melding som valgt', () => {
    const wrapper = shallow(
      <SupportMenySakIndex
        tilgjengeligeTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
        valgbareTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER, SupportTabs.DOKUMENTER]}
        valgtIndex={1}
        onClick={() => undefined}
        antallUlesteNotater={0}
      />,
    );

    const tabMeny = wrapper.find(TabMeny);
    expect(tabMeny).toHaveLength(1);

    const tabs = tabMeny.prop('tabs');
    expect(tabs[0].isActive).toBe(false);
    expect(tabs[0].isDisabled).toBe(false);
    expect(tabs[0].tooltip).toEqual('Historikk');
    expect(tabs[1].isActive).toBe(true);
    expect(tabs[1].isDisabled).toBe(false);
    expect(tabs[1].tooltip).toEqual('Send melding');
    expect(tabs[2].isActive).toBe(false);
    expect(tabs[2].isDisabled).toBe(false);
    expect(tabs[2].tooltip).toEqual('Dokumenter');
  });

  it('skal lage tabs og sette Send Melding til disablet', () => {
    const wrapper = shallow(
      <SupportMenySakIndex
        tilgjengeligeTabs={[SupportTabs.HISTORIKK, SupportTabs.MELDINGER]}
        valgbareTabs={[SupportTabs.HISTORIKK]}
        onClick={() => undefined}
        antallUlesteNotater={0}
      />,
    );

    const tabMeny = wrapper.find(TabMeny);
    expect(tabMeny).toHaveLength(1);

    const tabs = tabMeny.prop('tabs');
    expect(tabs[0].isActive).toBe(false);
    expect(tabs[0].isDisabled).toBe(false);
    expect(tabs[0].tooltip).toEqual('Historikk');
    expect(tabs[1].isActive).toBe(false);
    expect(tabs[1].isDisabled).toBe(true);
    expect(tabs[1].tooltip).toEqual('Send melding');
  });
});
