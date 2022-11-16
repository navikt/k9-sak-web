import React from 'react';
import { expect } from 'chai';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { VedtakInnvilgetPanelImpl } from './VedtakInnvilgetPanel';
import shallowWithIntl, { intlMock } from '../../i18n';

const foreldrepenger = fagsakYtelseType.FORELDREPENGER;
const behandlingsresultat = {
  type: {
    kode: 'INNVILGET',
  },
};

describe('<VedtakInnvilgetPanel>', () => {
  it('skal rendre innvilget panel for foreldrepenger', () => {
    const wrapper = shallowWithIntl(
      <VedtakInnvilgetPanelImpl
        intl={intlMock}
        behandlingTypeKode={behandlingType.FORSTEGANGSSOKNAD}
        beregningResultat={{
          beregnetTilkjentYtelse: 100,
        }}
        behandlingsresultatTypeKode="test"
        antallBarn={1}
        behandlinger={[]}
        ytelseTypeKode={foreldrepenger}
        behandlingsresultat={behandlingsresultat}
        skalBrukeOverstyrendeFritekstBrev
        readOnly
        beregningErManueltFastsatt={false}
      />,
    );
    const textFields = wrapper.find('ForwardRef');
    expect(textFields.first().childAt(0).text()).to.eql('Resultat');
    expect(textFields.at(1).childAt(0).text()).to.eql('Pleiepenger er innvilget');

    const elementFields = wrapper.find('Element');
    expect(elementFields).to.have.length(0);
  });
});
