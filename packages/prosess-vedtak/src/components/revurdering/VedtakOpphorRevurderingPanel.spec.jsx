import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { VedtakOpphorRevurderingPanelImpl } from './VedtakOpphorRevurderingPanel';

describe('<VedtakOpphorRevurderingPanel>', () => {
  it('skal rendre opphørpanel med avslagsårsak', () => {
    const vilkar = [
      {
        vilkarType: vilkarType.MEDLEMSKAPSVILKARET,
        vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
        lovReferanse: '§ 22-13, 2. ledd',
      },
    ];
    const behandlingsresultat = {
      id: 1,
      type: 'test',
      avslagsarsak: '1019',
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
        vilkarType: vilkarType.MEDLEMSKAPSVILKARET,
        vilkarStatus: vilkarUtfallType.IKKE_OPPFYLT,
        lovReferanse: '§ 22-13, 2. ledd',
      },
    ];
    const behandlingsresultat = {
      id: 1,
      type: 'test',
      avslagsarsak: '1019',
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
