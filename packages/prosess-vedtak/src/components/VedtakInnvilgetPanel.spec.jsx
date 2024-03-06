import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakInnvilgetPanelImpl } from './VedtakInnvilgetPanel';

const foreldrepenger = fagsakYtelseType.FORELDREPENGER;
const behandlingsresultat = {
  type: {
    kode: 'INNVILGET',
  },
};

describe('<VedtakInnvilgetPanel>', () => {
  it('skal rendre innvilget panel for foreldrepenger', () => {
    renderWithIntl(
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
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Pleiepenger er innvilget')).toBeInTheDocument();
  });
});
