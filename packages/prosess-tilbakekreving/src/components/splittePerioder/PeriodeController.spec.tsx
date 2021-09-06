import React from 'react';
import sinon from 'sinon';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';
import DelOppPeriodeModal from './DelOppPeriodeModal';
import { PeriodeController } from './PeriodeController';
import shallowWithIntl, { intlMock } from '../../../i18n';
import DataForPeriode from '../../types/dataForPeriodeTsType';

describe('<PeriodeController>', () => {
  it('skal vise knapp for å dele opp perioden og knapper for å velge forrige eller neste periode', () => {
    const wrapper = shallowWithIntl(
      <PeriodeController
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={sinon.spy()}
        oppdaterSplittedePerioder={sinon.spy()}
        callbackForward={sinon.spy()}
        callbackBackward={sinon.spy()}
        periode={{} as DataForPeriode}
        readOnly={false}
      />,
    );

    const knapper = wrapper.find(TimeLineButton);

    expect(knapper).toHaveLength(2);
    expect(knapper.first().prop('text').length).toBeGreaterThan(3);
    expect(knapper.last().prop('text').length).toBeGreaterThan(3);
  });

  it('skal ikke vise knapp for å dele opp perioder når readonly', () => {
    const wrapper = shallowWithIntl(
      <PeriodeController
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={sinon.spy()}
        oppdaterSplittedePerioder={sinon.spy()}
        callbackForward={sinon.spy()}
        callbackBackward={sinon.spy()}
        periode={{} as DataForPeriode}
        readOnly
      />,
    );

    expect(wrapper.find(TimeLineButton)).toHaveLength(2);
  });

  it('skal splitte periode via modal', async () => {
    const response = {
      perioder: [
        {
          belop: 400,
        },
        {
          belop: 600,
        },
      ],
    };
    const beregnBelop = () => Promise.resolve(response);
    const oppdaterSplittedePerioder = sinon.spy();
    const periode = {
      feilutbetaling: 1000,
    };
    const wrapper = shallowWithIntl(
      <PeriodeController
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={beregnBelop}
        oppdaterSplittedePerioder={oppdaterSplittedePerioder}
        callbackForward={sinon.spy()}
        callbackBackward={sinon.spy()}
        periode={periode as DataForPeriode}
        readOnly
      />,
    );
    wrapper.setState({ showDelPeriodeModal: true });

    const formValues = {
      forstePeriode: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
      andrePeriode: {
        fom: '2019-11-11',
        tom: '2019-12-10',
      },
    };

    const modal = wrapper.find(DelOppPeriodeModal);
    await modal.prop('splitPeriod')(formValues);

    expect(oppdaterSplittedePerioder.called).toBe(true);
    const { args } = oppdaterSplittedePerioder.getCalls()[0];
    expect(args).toHaveLength(1);
    expect(args[0]).toEqual([
      {
        feilutbetaling: 400,
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
      {
        feilutbetaling: 600,
        fom: '2019-11-11',
        tom: '2019-12-10',
      },
    ]);
  });
});
