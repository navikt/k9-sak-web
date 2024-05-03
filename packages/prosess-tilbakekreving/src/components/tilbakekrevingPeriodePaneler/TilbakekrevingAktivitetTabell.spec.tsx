import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import TilbakekrevingAktivitetTabell from './TilbakekrevingAktivitetTabell';

describe('<TilbakekrevingAktivitetTabell>', () => {
  it('skal ikke vise tabell når ytelselisten er tom', () => {
    renderWithIntl(<TilbakekrevingAktivitetTabell ytelser={[]} />, { messages });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal vise tabell med to rader når det finnes to ytelser', () => {
    renderWithIntl(
      <TilbakekrevingAktivitetTabell
        ytelser={[
          {
            aktivitet: 'test',
            belop: 1,
          },
          {
            aktivitet: 'test2',
            belop: 2,
          },
        ]}
      />,
      { messages },
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
