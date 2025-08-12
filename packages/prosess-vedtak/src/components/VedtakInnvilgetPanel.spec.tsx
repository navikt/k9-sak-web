import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { screen } from '@testing-library/react';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { kodeverk_behandling_BehandlingResultatType as BehandlingResultatType } from '@navikt/k9-sak-typescript-client';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakInnvilgetPanelImpl } from './VedtakInnvilgetPanel';

const foreldrepenger = fagsakYtelsesType.FORELDREPENGER;
const behandlingsresultat = {
  type: BehandlingResultatType.INNVILGET,
};

describe('<VedtakInnvilgetPanel>', () => {
  it('skal rendre innvilget panel for pleiepenger', () => {
    renderWithIntl(
      <VedtakInnvilgetPanelImpl
        intl={intlMock}
        ytelseTypeKode={foreldrepenger}
        behandlingsresultat={behandlingsresultat}
        simuleringResultat={{
          simuleringResultat: undefined,
          simuleringResultatUtenInntrekk: undefined,
          slåttAvInntrekk: undefined,
        }}
        kodeverkNavnFraKode={vi.fn()}
        behandlingType={behandlingType.FORSTEGANGSSOKNAD}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Pleiepenger er innvilget')).toBeInTheDocument();
  });
});
