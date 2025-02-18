import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { screen } from '@testing-library/react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { VedtakOpphorRevurderingPanelImpl } from './VedtakOpphorRevurderingPanel';

describe('<VedtakOpphorRevurderingPanel>', () => {
  it('skal rendre opphørpanel med avslagsårsak', () => {
    renderWithIntl(
      <VedtakOpphorRevurderingPanelImpl
        intl={intlMock}
        ytelseTypeKode={fagsakYtelsesType.FORELDREPENGER}
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
        ytelseTypeKode={fagsakYtelsesType.SVANGERSKAPSPENGER}
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
