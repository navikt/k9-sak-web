import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakAvslagPanelImpl } from './VedtakAvslagPanel';

const pleiepenger = fagsakYtelseType.PLEIEPENGER;
const omsorgspenger = fagsakYtelseType.OMSORGSPENGER;
const kroniskSyktBarn = fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN;
const midlertidigAlene = fagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE;

describe('<VedtakAvslagPanel>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    fagsakId: 1,
    aksjonspunkter: [],
    behandlingPaaVent: false,
    behandlingHenlagt: false,
    sprakkode: 'NO',
    behandlingsresultat: {
      id: 1,
      type: 'test',
      avslagsarsak: '1019',
      avslagsarsakFritekst: null,
    },
    vilkar: [
      {
        vilkarType: vilkarType.MEDLEMSKAPSVILKARET, // 'Medlemskapsvilkåret'
        lovReferanse: '§ 22-13, 2. ledd',
        perioder: [
          {
            vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
          },
        ],
      },
    ],
    status: behandlingStatus.BEHANDLING_UTREDES,
    type: 'test',
    opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
  };

  const sprakkode = 'NO';

  const vilkarUtenSoknadsfrist = [
    {
      vilkarType: vilkarType.MEDLEMSKAPSVILKARET,
      lovReferanse: '§ 22-13, 2. ledd',
      perioder: [{ vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT }],
    },
  ];

  const behandlingsresultat = {
    id: 1,
    type: 'test',
  };

  it('skal rendre avslagspanel for pleiepenger', () => {
    renderWithIntl(
      <VedtakAvslagPanelImpl
        intl={intlMock}
        vilkar={vilkarUtenSoknadsfrist}
        behandlingsresultat={behandlingsresultat}
        sprakkode={sprakkode}
        readOnly
        behandlinger={[behandling]}
        ytelseTypeKode={pleiepenger}
        alleKodeverk={{}}
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
        sprakkode={sprakkode}
        readOnly
        behandlinger={[behandling]}
        ytelseTypeKode={omsorgspenger}
        alleKodeverk={{}}
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
        sprakkode={sprakkode}
        readOnly
        behandlinger={[behandling]}
        ytelseTypeKode={kroniskSyktBarn}
        alleKodeverk={{}}
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
        sprakkode={sprakkode}
        readOnly
        behandlinger={[behandling]}
        ytelseTypeKode={midlertidigAlene}
        alleKodeverk={{}}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ekstra omsorgsdager er avslått')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
