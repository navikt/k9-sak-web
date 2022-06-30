import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { SideMenu } from '@navikt/ft-plattform-komponenter';

import { Behandling } from '@k9-sak-web/types';

import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre tabs dersom bare en periode', () => {
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
                vurdersIBehandlingen: true,
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
        visAllePerioder={false}
      />,
    );

    const tabs = wrapper.find(SideMenu);
    expect(tabs).toHaveLength(1);
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
                vurdersIBehandlingen: true,
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
                vurdersIBehandlingen: false,
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
        visAllePerioder={false}
      />,
    );

    const tabs = wrapper.find(SideMenu);
    expect(tabs).toHaveLength(1);
  });
});
