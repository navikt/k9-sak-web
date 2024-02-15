import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
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
    sprakkode: {
      kode: 'NO',
      navn: 'norsk',
    },
    behandlingsresultat: {
      id: 1,
      type: {
        kode: 'test',
        navn: 'test',
      },
      avslagsarsak: {
        kode: '1019',
        navn: 'Manglende dokumentasjon',
      },
      avslagsarsakFritekst: null,
    },
    vilkar: [
      {
        vilkarType: {
          kode: vilkarType.MEDLEMSKAPSVILKARET,
          navn: 'Medlemskapsvilkåret',
        },
        lovReferanse: '§ 22-13, 2. ledd',
        perioder: [
          {
            vilkarStatus: {
              kode: vilkarUtfallType.IKKE_OPPFYLT,
              navn: 'test',
            },
          },
        ],
      },
    ],
    status: {
      kode: behandlingStatus.BEHANDLING_UTREDES,
      navn: 'test',
    },
    type: {
      kode: 'test',
      navn: 'test',
    },
    opprettet: '16‎.‎07‎.‎2004‎ ‎17‎:‎35‎:‎21',
  };

  const sprakkode = {
    kode: 'NO',
    navn: 'norsk',
  };

  const vilkarUtenSoknadsfrist = [
    {
      vilkarType: {
        kode: vilkarType.MEDLEMSKAPSVILKARET,
        navn: 'Medlemskapsvilkåret',
      },
      lovReferanse: '§ 22-13, 2. ledd',
      perioder: [
        {
          vilkarStatus: {
            kode: vilkarUtfallType.IKKE_OPPFYLT,
            navn: 'test',
          },
        },
      ],
    },
  ];

  const behandlingsresultat = {
    id: 1,
    type: {
      kode: 'test',
      navn: 'test',
    },
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
