import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { behandlingResultatType, vilkarStatus } from '@navikt/k9-sak-typescript-client';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakAvslagPanelImpl } from './VedtakAvslagPanel';

const pleiepenger = fagsakYtelseType.PLEIEPENGER;
const omsorgspenger = fagsakYtelseType.OMSORGSPENGER;
const kroniskSyktBarn = fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN;
const midlertidigAlene = fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE;

describe('<VedtakAvslagPanel>', () => {
  const vilkarUtenSoknadsfrist = [
    {
      vilkarType: vilkarType.MEDLEMSKAPSVILKÅRET,
      lovReferanse: '§ 22-13, 2. ledd',
      perioder: [
        {
          vilkarStatus: vilkarStatus.IKKE_OPPFYLT,
          periode: { fom: '', tom: '' },
        },
      ],
    },
  ];

  const behandlingsresultat = {
    id: 1,
    type: behandlingResultatType.IKKE_FASTSATT,
  };

  it('skal rendre avslagspanel for pleiepenger', () => {
    renderWithIntl(
      <VedtakAvslagPanelImpl
        intl={intlMock}
        vilkar={vilkarUtenSoknadsfrist}
        behandlingsresultat={behandlingsresultat}
        ytelseTypeKode={pleiepenger}
        simuleringResultat={{}}
        kodeverkNavnFraKode={vi.fn()}
        tilbakekrevingvalg={{ erTilbakekrevingVilkårOppfylt: false }}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Pleiepenger er avslått')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal rendre avslagspanel for omsorgspenger', () => {
    renderWithIntl(
      <VedtakAvslagPanelImpl
        intl={intlMock}
        vilkar={vilkarUtenSoknadsfrist}
        behandlingsresultat={behandlingsresultat}
        ytelseTypeKode={omsorgspenger}
        simuleringResultat={{}}
        kodeverkNavnFraKode={vi.fn()}
        tilbakekrevingvalg={{ erTilbakekrevingVilkårOppfylt: false }}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Omsorgspenger er avslått')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal rendre avslagspanel for utvidet rett kronisk sykt barn', () => {
    renderWithIntl(
      <VedtakAvslagPanelImpl
        intl={intlMock}
        vilkar={vilkarUtenSoknadsfrist}
        behandlingsresultat={behandlingsresultat}
        ytelseTypeKode={kroniskSyktBarn}
        simuleringResultat={{}}
        kodeverkNavnFraKode={vi.fn()}
        tilbakekrevingvalg={{ erTilbakekrevingVilkårOppfylt: false }}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ekstra omsorgsdager er avslått')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal rendre avslagspanel for midlertidig alene', () => {
    renderWithIntl(
      <VedtakAvslagPanelImpl
        intl={intlMock}
        vilkar={vilkarUtenSoknadsfrist}
        behandlingsresultat={behandlingsresultat}
        ytelseTypeKode={midlertidigAlene}
        simuleringResultat={{}}
        kodeverkNavnFraKode={vi.fn()}
        tilbakekrevingvalg={{ erTilbakekrevingVilkårOppfylt: false }}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ekstra omsorgsdager er avslått')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
