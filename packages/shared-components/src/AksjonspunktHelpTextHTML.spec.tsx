import React from 'react';
import { FormattedMessage } from 'react-intl';

import AksjonspunktHelpTextHTML from './AksjonspunktHelpTextHTML';

import shallowWithIntl, { intlMock } from '../i18n/index';

describe('<AksjonspunktHelpTextHTML>', () => {
  it('Skal teste at aksjonspunkt hjelp viser riktig', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpTextHTML.WrappedComponent intl={intlMock}>
        {[<FormattedMessage key="1" id="Beregningsgrunnlag.Helptext.Arbeidstaker2" values={{ verdi: 23 }} />]}
      </AksjonspunktHelpTextHTML.WrappedComponent>,
    );
    const flexContainer = wrapper.find('FlexContainer');
    const messages = flexContainer.first().find('MemoizedFormattedMessage');
    expect(messages.at(0).prop('id')).toEqual('Beregningsgrunnlag.Helptext.Arbeidstaker2');
    expect(messages.at(0).prop('values')).toEqual({ verdi: 23 });
    const image = flexContainer.first().find('Image');
    expect(image.length).toBe(1);
  });
  it('Skal teste at aksjonspunkt hjelp ikke vises når ikke aksjonspunkt', () => {
    const wrapper = shallowWithIntl(
      <AksjonspunktHelpTextHTML.WrappedComponent intl={intlMock}>{[]}</AksjonspunktHelpTextHTML.WrappedComponent>,
    );
    const flexContainer = wrapper.find('FlexContainer');
    expect(flexContainer.length).toBe(0);
  });
});
