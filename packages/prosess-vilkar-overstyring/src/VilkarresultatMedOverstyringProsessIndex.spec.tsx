import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import SideMenu from '@navikt/nap-side-menu';

import { Behandling } from '@k9-sak-web/types';

import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal ikke rendre tabs dersom bare en periode', () => {
    const wrapper = shallow(
      <VilkarresultatMedOverstyringProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
          } as Behandling
        }
        medlemskap={{
          fom: '2020-05-05',
        }}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={sinon.spy()}
        submitCallback={sinon.spy()}
        aksjonspunkter={[]}
        avslagsarsaker={[]}
        panelTittelKode="tittel"
        overstyringApKode=""
        lovReferanse=""
        erOverstyrt={false}
        overrideReadOnly={false}
        erMedlemskapsPanel={false}
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

    const tabs = wrapper.find(SideMenu);
    expect(tabs).to.have.length(0);
  });

  it('skal rendre tabs dersom mer enn en periode', () => {
    const wrapper = shallow(
      <VilkarresultatMedOverstyringProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
          } as Behandling
        }
        medlemskap={{
          fom: '2020-05-05',
        }}
        aksjonspunkter={[]}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={sinon.spy()}
        submitCallback={sinon.spy()}
        avslagsarsaker={[]}
        panelTittelKode="tittel"
        overstyringApKode=""
        lovReferanse=""
        erOverstyrt={false}
        overrideReadOnly={false}
        erMedlemskapsPanel={false}
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

    const tabs = wrapper.find(SideMenu);
    expect(tabs).to.have.length(1);
  });
});
