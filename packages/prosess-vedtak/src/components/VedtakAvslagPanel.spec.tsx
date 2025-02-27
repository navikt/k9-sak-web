import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingDtoBehandlingResultatType, VilkårPeriodeDtoVilkarStatus } from '@navikt/k9-sak-typescript-client';
import { screen } from '@testing-library/react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakAvslagPanelImpl } from './VedtakAvslagPanel';

const pleiepenger = fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
const omsorgspenger = fagsakYtelsesType.OMSORGSPENGER;
const kroniskSyktBarn = fagsakYtelsesType.OMSORGSPENGER_KS;
const midlertidigAlene = fagsakYtelsesType.OMSORGSPENGER_MA;

describe('<VedtakAvslagPanel>', () => {
  const vilkarUtenSoknadsfrist = [
    {
      vilkarType: vilkarType.MEDLEMSKAPSVILKÅRET,
      lovReferanse: '§ 22-13, 2. ledd',
      perioder: [
        {
          vilkarStatus: VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT,
          periode: { fom: '', tom: '' },
        },
      ],
    },
  ];

  const behandlingsresultat = {
    id: 1,
    type: BehandlingDtoBehandlingResultatType.IKKE_FASTSATT,
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
