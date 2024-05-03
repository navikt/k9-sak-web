import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { VedtakOpphorRevurderingPanelImpl } from './VedtakOpphorRevurderingPanel';

describe('<VedtakOpphorRevurderingPanel>', () => {
  it('skal rendre opphørpanel med avslagsårsak', () => {
    const vilkar = [
      {
        vilkarType: {
          kode: vilkarType.MEDLEMSKAPSVILKARET,
          navn: 'Medlemskapsvilkåret',
        },
        vilkarStatus: {
          kode: vilkarUtfallType.IKKE_OPPFYLT,
          navn: 'test',
        },
        lovReferanse: '§ 22-13, 2. ledd',
      },
    ];
    const behandlingsresultat = {
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
    };
    renderWithIntl(
      <VedtakOpphorRevurderingPanelImpl
        intl={intlMock}
        vilkar={vilkar}
        readOnly
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        aksjonspunkter={[]}
        behandlingsresultat={behandlingsresultat}
        revurderingsAarsakString="Test"
        beregningErManueltFastsatt={false}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ytelsen opphører')).toBeInTheDocument();
  });
  it('skal rendre opphørpanel med avslagsårsak før svangerskapspenger', () => {
    const vilkar = [
      {
        vilkarType: {
          kode: vilkarType.MEDLEMSKAPSVILKARET,
          navn: 'Medlemskapsvilkåret',
        },
        vilkarStatus: {
          kode: vilkarUtfallType.IKKE_OPPFYLT,
          navn: 'test',
        },
        lovReferanse: '§ 22-13, 2. ledd',
      },
    ];
    const behandlingsresultat = {
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
    };
    renderWithIntl(
      <VedtakOpphorRevurderingPanelImpl
        intl={intlMock}
        vilkar={vilkar}
        readOnly
        ytelseTypeKode={fagsakYtelseType.SVANGERSKAPSPENGER}
        aksjonspunkter={[]}
        behandlingsresultat={behandlingsresultat}
        revurderingsAarsakString="Test"
        beregningErManueltFastsatt={false}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ytelsen opphører')).toBeInTheDocument();
  });
});
