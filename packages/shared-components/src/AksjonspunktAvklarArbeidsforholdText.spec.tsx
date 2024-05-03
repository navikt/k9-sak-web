import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import AksjonspunktAvklarArbeidsforholdText from './AksjonspunktAvklarArbeidsforholdText';

describe('<AksjonspunktAvklarArbeidsforholdText>', () => {
  it('Utleder riktig text når arbeidsforholdet er registrert uten IM', () => {
    renderWithIntl(
      <AksjonspunktAvklarArbeidsforholdText.WrappedComponent
        intl={intlMock}
        arbeidsforhold={
          {
            arbeidsforhold: {
              eksternArbeidsforholdId: '5678',
            },
            aksjonspunktÅrsaker: [
              {
                kode: 'INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD',
                kodeverk: 'ARBEIDSFORHOLD_AKSJONSPUNKT_ÅRSAKER',
              },
            ],
          } as ArbeidsforholdV2
        }
      />,
    );

    expect(screen.getByText('HelpText.FinnesIkkeIRegisteret')).toBeInTheDocument();
    expect(screen.getByText('HelpText.TaKontakt')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
  it('Utleder riktig text når det er overgang av arbeidsforhold-Id', () => {
    renderWithIntl(
      <AksjonspunktAvklarArbeidsforholdText.WrappedComponent
        intl={intlMock}
        arbeidsforhold={
          {
            aksjonspunktÅrsaker: [
              {
                kode: 'OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE',
                kodeverk: 'ARBEIDSFORHOLD_AKSJONSPUNKT_ÅRSAKER',
              },
            ],
          } as ArbeidsforholdV2
        }
      />,
    );

    expect(screen.getByText('HelpText.OvergangAbedsforholdsId')).toBeInTheDocument();
    expect(screen.getByText('HelpText.TaKontaktOvergangArbeidsforholdId')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
});
