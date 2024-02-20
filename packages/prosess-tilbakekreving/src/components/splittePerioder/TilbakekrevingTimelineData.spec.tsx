import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../../../i18n/nb_NO.json';
import DataForPeriode from '../../types/dataForPeriodeTsType';
import TilbakekrevingTimelineData from './TilbakekrevingTimelineData';

describe('<TilbakekrevingTimelineData>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntl(
      <TilbakekrevingTimelineData
        periode={
          {
            fom: '2019-10-10',
            tom: '2019-11-10',
            feilutbetaling: 12,
          } as DataForPeriode
        }
        callbackForward={sinon.spy()}
        callbackBackward={sinon.spy()}
        readOnly={false}
        oppdaterSplittedePerioder={sinon.spy()}
        behandlingId={1}
        behandlingVersjon={1}
        beregnBelop={() => undefined}
      />,
      { messages },
    );

    expect(screen.getByText('Detaljer for valgt periode')).toBeInTheDocument();
    expect(screen.getByText('10.10.2019 - 10.11.2019')).toBeInTheDocument();
  });
});
