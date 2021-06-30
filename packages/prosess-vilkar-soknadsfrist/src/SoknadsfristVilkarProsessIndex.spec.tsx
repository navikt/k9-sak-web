import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { SideMenu } from '@navikt/k9-react-components';

import { Behandling } from '@k9-sak-web/types';

import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';

const soknadsfristStatus = {
  dokumentStatus: [],
};

describe('<SoknadsfristVilkarForm>', () => {
  it('skal ikke rendre tabs dersom bare en periode', () => {
    const wrapper = shallow(
      <SoknadsfristVilkarProsessIndex
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
        lovReferanse=""
        erOverstyrt={false}
        overrideReadOnly={false}
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
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder
      />,
    );

    const tabs = wrapper.find(SideMenu);
    expect(tabs).toHaveLength(0);
  });

  it('skal rendre tabs dersom mer enn en periode', () => {
    const wrapper = shallow(
      <SoknadsfristVilkarProsessIndex
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
        lovReferanse=""
        erOverstyrt={false}
        overrideReadOnly={false}
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
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder
      />,
    );

    const tabs = wrapper.find(SideMenu);
    expect(tabs).toHaveLength(1);
  });
});
