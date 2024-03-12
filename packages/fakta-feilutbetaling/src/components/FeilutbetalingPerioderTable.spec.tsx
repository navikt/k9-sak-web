import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable';

const perioder = [
  {
    fom: '2016-03-16',
    tom: '2016-05-26',
  },
  {
    fom: '2016-06-27',
    tom: '2016-07-26',
  },
];

const headerTextCodes = [
  'FeilutbetalingInfoPanel.Period',
  'FeilutbetalingInfoPanel.Hendelse',
  'FeilutbetalingInfoPanel.Beløp',
];

const mockProps = {
  perioder,
  årsaker: [],
  formName: 'FaktaFeilutbetalingForm',
  readOnly: false,
  onChangeÅrsak: vi.fn(),
  onChangeUnderÅrsak: vi.fn(),
  behandlingId: 1,
  behandlingVersjon: 1,
};

describe('<FeilutbetalingPerioderTable>', () => {
  it('skal rendre FeilutbetalingInfoPanel', () => {
    renderWithIntlAndReduxForm(<FeilutbetalingPerioderTable {...mockProps} />, { messages });

    expect(screen.getByRole('cell', { name: 'Period' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Hendelse' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Feilutbetalt beløp' })).toBeInTheDocument();
  });
});
