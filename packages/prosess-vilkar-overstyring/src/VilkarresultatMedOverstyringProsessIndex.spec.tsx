import { shallow } from 'enzyme';
import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import { expect } from 'chai';
import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal ikke rendre tabs dersom bare en periode', () => {
    const wrapper = shallow(
      <VilkarresultatMedOverstyringProsessIndex
        behandling={{
          id: 1,
          versjon: 1,
        }}
        medlemskap={{
          fom: '2020-05-05',
        }}
        aksjonspunkter={[]}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: {
                  kode: 'test',
                  kodeverk: 'test',
                },
                avslagKode: 'test',
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: {
              kode: 'test',
              kodeverk: 'test',
            },
          },
        ]}
      />,
    );

    const tabs = wrapper.find(TabsPure);
    expect(tabs).to.have.length(0);
  });

  it('skal rendre tabs dersom mer enn en periode', () => {
    const wrapper = shallow(
      <VilkarresultatMedOverstyringProsessIndex
        behandling={{
          id: 1,
          versjon: 1,
        }}
        medlemskap={{
          fom: '2020-05-05',
        }}
        aksjonspunkter={[]}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: {
                  kode: 'test',
                  kodeverk: 'test',
                },
                avslagKode: 'test',
                merknadParametere: {
                  test: 'test',
                },
              },
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: {
                  kode: 'test',
                  kodeverk: 'test',
                },
                avslagKode: 'test',
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: {
              kode: 'test',
              kodeverk: 'test',
            },
          },
        ]}
      />,
    );

    const tabs = wrapper.find(TabsPure);
    expect(tabs).to.have.length(1);
  });
});
