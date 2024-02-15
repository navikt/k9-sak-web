import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { BeregningResultatPeriode } from '../types/beregningsresultatTilbakekrevingTsType';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';

describe('<TilbakekrevingVedtakPeriodeTabell>', () => {
  it('skal lage tabell med to perioder og en sum-rad', () => {
    const perioder = [
      {
        periode: {
          fom: '2019-10-10',
          tom: '2019-12-10',
        },
        feilutbetaltBeløp: 15430,
        vurdering: {
          kode: 'SIMP',
          kodeverk: 'VURDERING',
        },
        andelAvBeløp: 100,
        renterProsent: 10,
        tilbakekrevingBeløp: 15430,
        tilbakekrevingBeløpEtterSkatt: 14000,
      },
      {
        periode: {
          fom: '2019-05-10',
          tom: '2019-06-10',
        },
        feilutbetaltBeløp: 14000,
        vurdering: {
          kode: 'SIMP',
          kodeverk: 'VURDERING',
        },
        andelAvBeløp: 50,
        tilbakekrevingBeløp: 7000,
        tilbakekrevingBeløpEtterSkatt: 6000,
      },
    ] as BeregningResultatPeriode[];
    const getKodeverknavn = () => 'Simpel uaktsomhet';

    renderWithIntl(<TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />, {
      messages,
    });

    expect(screen.getAllByText((_, element) => element.textContent === '10.10.2019-10.12.2019')[0]).toBeInTheDocument();
    expect(screen.getAllByText('15 430').length).toBe(2);
    expect(screen.getAllByText('Simpel uaktsomhet').length).toBe(2);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getAllByText('15 430').length).toBe(2);
    expect(screen.getAllByText('14 000').length).toBe(2);

    expect(screen.getAllByText((_, element) => element.textContent === '10.05.2019-10.06.2019')[0]).toBeInTheDocument();
    expect(screen.getAllByText('14 000').length).toBe(2);
    expect(screen.getAllByText('Simpel uaktsomhet').length).toBe(2);
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('7 000')).toBeInTheDocument();
    expect(screen.getByText('6 000')).toBeInTheDocument();

    expect(screen.getByText('Sum')).toBeInTheDocument();
    expect(screen.getByText('29 430')).toBeInTheDocument();
    expect(screen.getByText('22 430')).toBeInTheDocument();
    expect(screen.getByText('20 000')).toBeInTheDocument();
  });
});
