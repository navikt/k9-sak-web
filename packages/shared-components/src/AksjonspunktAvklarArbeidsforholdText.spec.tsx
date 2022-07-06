import React from 'react';
import { expect } from 'chai';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import AksjonspunktAvklarArbeidsforholdText from './AksjonspunktAvklarArbeidsforholdText';

import shallowWithIntl, { intlMock } from '../i18n/index';

describe('<AksjonspunktAvklarArbeidsforholdText>', () => {
  it('Utleder riktig text når arbeidsforholdet er registrert uten IM', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktAvklarArbeidsforholdText.WrappedComponent
        intl={intlMock}
        arbeidsforhold={
          {
            arbeidsforhold: {
              eksternArbeidsforholdId: '5678',
            },
            aksjonspunktÅrsaker: ['INNTEKTSMELDING_UTEN_ARBEIDSFORHOLD'],
          } as ArbeidsforholdV2
        }
      />,
    );
    const flexContainer = wrapper.find('FlexContainer');
    const messages = flexContainer.first().find('MemoizedFormattedMessage');
    expect(messages.at(0).prop('id')).is.eql('HelpText.FinnesIkkeIRegisteret');
    expect(messages.at(1).prop('id')).is.eql('HelpText.TaKontakt');
    const image = flexContainer.first().find('Image');
    expect(image.length).to.equal(1);
  });
  it('Utleder riktig text når det er overgang av arbeidsforhold-Id', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktAvklarArbeidsforholdText.WrappedComponent
        intl={intlMock}
        arbeidsforhold={
          {
            aksjonspunktÅrsaker: ['OVERGANG_ARBEIDSFORHOLDS_ID_UNDER_YTELSE'],
          } as ArbeidsforholdV2
        }
      />,
    );
    const flexContainer = wrapper.find('FlexContainer');
    const messages = flexContainer.first().find('MemoizedFormattedMessage');
    expect(messages.at(0).prop('id')).is.eql('HelpText.OvergangAbedsforholdsId');
    expect(messages.at(1).prop('id')).is.eql('HelpText.TaKontaktOvergangArbeidsforholdId');
    const image = flexContainer.first().find('Image');
    expect(image.length).to.equal(1);
  });
});
