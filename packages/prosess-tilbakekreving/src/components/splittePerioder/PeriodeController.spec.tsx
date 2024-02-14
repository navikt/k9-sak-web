import { renderWithIntl, renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import DataForPeriode from '../../types/dataForPeriodeTsType';
import { PeriodeController } from './PeriodeController';

describe('<PeriodeController>', () => {
  it('skal vise knapp for å dele opp perioden og knapper for å velge forrige eller neste periode', () => {
    renderWithIntl(
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
      { messages },
    );

    expect(screen.getByText('Del opp perioden')).toBeInTheDocument();
    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
  });

  it('skal ikke vise knapp for å dele opp perioder når readonly', () => {
    renderWithIntl(
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
      { messages },
    );

    expect(screen.queryByText('Del opp perioden')).not.toBeInTheDocument();
    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
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
      fom: '2019-10-10',
      tom: '2019-12-10',
    };
    renderWithIntlAndReduxForm(
      <PeriodeController
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={beregnBelop}
        oppdaterSplittedePerioder={oppdaterSplittedePerioder}
        callbackForward={sinon.spy()}
        callbackBackward={sinon.spy()}
        periode={periode as DataForPeriode}
        readOnly={false}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('img', { name: 'Del opp perioden' }));
    });
    await act(async () => {
      await userEvent.type(screen.getByRole('textbox'), '10.11.2019');
      await userEvent.click(screen.getByRole('button', { name: 'Ok' }));
    });

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
