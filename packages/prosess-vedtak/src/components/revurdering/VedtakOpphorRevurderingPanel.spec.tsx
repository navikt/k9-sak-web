import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import { behandlingResultatType } from '@navikt/k9-sak-typescript-client';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { VedtakOpphorRevurderingPanelImpl } from './VedtakOpphorRevurderingPanel';

describe('<VedtakOpphorRevurderingPanel>', () => {
  it('skal rendre opphørpanel med avslagsårsak', () => {
    renderWithIntl(
      <VedtakOpphorRevurderingPanelImpl
        intl={intlMock}
        ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
        resultatstruktur={{ type: behandlingResultatType.IKKE_FASTSATT }}
        medlemskapFom="2021-01-01"
        vedtakVarsel={{
          avslagsarsak: '1019',
          avslagsarsakFritekst: null,
          id: 1,
          overskrift: 'Overskrift',
          vedtaksdato: '2021-01-01',
          fritekstbrev: 'Fritekstbrev',
          skjæringstidspunkt: { dato: '2021-01-01' },
          redusertUtbetalingÅrsaker: [],
          vedtaksbrev: 'Vedtaksbrev',
        }}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ytelsen opphører')).toBeInTheDocument();
  });
  it('skal rendre opphørpanel med avslagsårsak før svangerskapspenger', () => {
    renderWithIntl(
      <VedtakOpphorRevurderingPanelImpl
        intl={intlMock}
        ytelseTypeKode={fagsakYtelseType.SVANGERSKAPSPENGER}
        resultatstruktur={{ type: behandlingResultatType.IKKE_FASTSATT }}
        medlemskapFom="2021-01-01"
        vedtakVarsel={{
          avslagsarsak: '1019',
          avslagsarsakFritekst: null,
          id: 1,
          overskrift: 'Overskrift',
          vedtaksdato: '2021-01-01',
          fritekstbrev: 'Fritekstbrev',
          skjæringstidspunkt: { dato: '2021-01-01' },
          redusertUtbetalingÅrsaker: [],
          vedtaksbrev: 'Vedtaksbrev',
        }}
      />,
      { messages },
    );

    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText('Ytelsen opphører')).toBeInTheDocument();
  });
});
