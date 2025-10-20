import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import TilbakekrevingTimeline from './TilbakekrevingTimeline';

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

    renderWithIntl(
      <TilbakekrevingTimeline.WrappedComponent
        intl={intlMock}
        perioder={perioder}
        selectedPeriod={valgtPeriode}
        toggleDetaljevindu={vi.fn()}
        selectPeriodCallback={vi.fn()}
        hjelpetekstKomponent={<div>test</div>}
        kjonn="MANN"
      />,
      { messages },
    );

    expect(screen.getByLabelText('Forrige periode')).toBeInTheDocument();
    expect(screen.getByLabelText('Neste periode')).toBeInTheDocument();
  });
});
