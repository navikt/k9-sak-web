import React from 'react';
import sinon from 'sinon';
import moment from 'moment';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';

import { Timeline, TimeLineControl } from '@fpsak-frontend/tidslinje';
import TilbakekrevingTimeline from './TilbakekrevingTimeline';
import shallowWithIntl from '../../../i18n';

describe('<TilbakekrevingTimeline>', () => {
  it('skal rendre tidslinje korrekt', () => {
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

    const wrapper = shallowWithIntl(
      <TilbakekrevingTimeline.WrappedComponent
        intl={intlMock}
        perioder={perioder}
        selectedPeriod={valgtPeriode}
        toggleDetaljevindu={sinon.spy()}
        selectPeriodCallback={sinon.spy()}
        hjelpetekstKomponent={<div>test</div>}
        kjonn="MANN"
      />,
    );

    expect(wrapper.find(TimeLineControl)).has.length(1);

    const tidslinje = wrapper.find(Timeline);
    const options = tidslinje.prop('options');
    expect(moment(options.min).format(ISO_DATE_FORMAT)).is.eql('2019-09-12');
    expect(moment(options.max).format(ISO_DATE_FORMAT)).is.eql('2023-10-10');

    expect(tidslinje.prop('initialGroups')).is.eql([{ id: 1, content: '' }]);
  });
});
