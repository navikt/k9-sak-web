import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import TilbakekrevingTimelinePanel from './TilbakekrevingTimelinePanel';

describe('<TilbakekrevingTimelinePanel>', () => {
  it('skal rendre komponent korrekt', () => {
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

    const setPeriode = vi.fn();
    renderWithIntl(
      <TilbakekrevingTimelinePanel
        perioder={perioder}
        valgtPeriode={valgtPeriode}
        setPeriode={setPeriode}
        toggleDetaljevindu={vi.fn()}
        kjonn="MANN"
        hjelpetekstKomponent={<div>test</div>}
      />,
      { messages },
    );

    expect(screen.getByText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByText('Neste periode')).toBeInTheDocument();
  });
});
