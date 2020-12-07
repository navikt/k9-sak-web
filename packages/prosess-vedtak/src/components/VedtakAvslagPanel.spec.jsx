import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import VedtakFritekstPanel from './VedtakFritekstPanel';
import { VedtakAvslagPanelImpl } from './VedtakAvslagPanel';
import shallowWithIntl from '../../i18n';

const pleiepenger = fagsakYtelseType.PLEIEPENGER;
const omsorgspenger = fagsakYtelseType.OMSORGSPENGER;

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
    const wrapper = shallowWithIntl(
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
    );

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Pleiepenger er avslått');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(0);
  });

  it('skal rendre avslagspanel for omsorgspenger', () => {
    const wrapper = shallowWithIntl(
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
    );

    const undertekstFields = wrapper.find('Undertekst');
    expect(undertekstFields).to.have.length(2);
    expect(undertekstFields.first().childAt(0).text()).to.eql('Resultat');

    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).to.have.length(1);
    expect(normaltekstFields.first().childAt(0).text()).to.eql('Omsorgspenger er avslått');

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(0);
  });
});
