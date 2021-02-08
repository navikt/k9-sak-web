import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import TilbakekrevingTimeline from './TilbakekrevingTimeline';
import TilbakekrevingTimelinePanel from './TilbakekrevingTimelinePanel';

describe('<TilbakekrevingTimelinePanel>', () => {
  it('skal rendre komponent korrekt og velge periode ved trykk på periode i tidslinje', () => {
    const perioder = [
      {
        id: 1,
        fom: '2019-10-10',
        tom: '2019-11-10',
        isAksjonspunktOpen: true,
        isGodkjent: true,
      },
      {
        id: 2,
        fom: '2019-11-11',
        tom: '2019-12-10',
        isAksjonspunktOpen: false,
        isGodkjent: true,
      },
    ];
    const valgtPeriode = {
      id: 1,
      fom: '2019-10-10',
      tom: '2019-11-10',
      isAksjonspunktOpen: true,
      isGodkjent: true,
    };

    const setPeriode = sinon.spy();
    const wrapper = shallow(
      <TilbakekrevingTimelinePanel
        perioder={perioder}
        valgtPeriode={valgtPeriode}
        setPeriode={setPeriode}
        toggleDetaljevindu={sinon.spy()}
        kjonn="MANN"
        hjelpetekstKomponent={<div>test</div>}
      />,
    );

    const tidslinje = wrapper.find(TilbakekrevingTimeline);
    expect(tidslinje).toHaveLength(1);

    const event = {
      event: {
        preventDefault: () => undefined,
      },
      items: [2],
    };
    tidslinje.prop('selectPeriodCallback')(event);

    expect(setPeriode.called).toBe(true);
    const { args } = setPeriode.getCalls()[0];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual(perioder[1]);
  });
});
