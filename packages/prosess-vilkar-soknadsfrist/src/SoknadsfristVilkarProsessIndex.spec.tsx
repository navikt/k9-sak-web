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
  it('skal rendre tabs dersom bare en periode', () => {
    const wrapper = shallow(
      <SoknadsfristVilkarProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
          } as Behandling
        }
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={sinon.spy()}
        submitCallback={sinon.spy()}
        aksjonspunkter={[]}
        panelTittelKode="tittel"
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
                vilkarStatus: 'test',
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: 'test',
          },
        ]}
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder={false}
      />,
    );

    const tabs = wrapper.find(SideMenu);
    expect(tabs).toHaveLength(1);
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
        aksjonspunkter={[]}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={sinon.spy()}
        submitCallback={sinon.spy()}
        panelTittelKode="tittel"
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
                vilkarStatus: 'test',
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: 'test',
                avslagKode: 'test',
                vurderesIBehandlingen: false,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: 'test',
          },
        ]}
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder={false}
      />,
    );

    const tabs = wrapper.find(SideMenu);
    expect(tabs).toHaveLength(1);
  });
});
