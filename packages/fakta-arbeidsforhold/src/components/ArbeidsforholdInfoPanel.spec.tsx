import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/src/AksjonspunktHelpText';

import { ArbeidsforholdInfoPanelImpl } from './ArbeidsforholdInfoPanel';
import { intlMock } from '../../i18n/intl-enzyme-test-helper-fakta-arbeidsforhold';
import PersonArbeidsforholdPanel from './PersonArbeidsforholdPanel';
import BekreftOgForsettKnapp from './BekreftOgForsettKnapp';

const ap5080 = {
  aksjonspunktType: {
    kode: 'MANU',
    kodeverk: 'AKSJONSPUNKT_TYPE',
  },
  begrunnelse: null,
  besluttersBegrunnelse: null,
  definisjon: {
    kode: '5080',
    kodeverk: 'AKSJONSPUNKT_DEF',
  },
  erAktivt: true,
  fristTid: null,
  kanLoses: true,
  status: {
    kode: 'OPPR',
    kodeverk: 'AKSJONSPUNKT_STATUS',
  },
  toTrinnsBehandling: false,
  toTrinnsBehandlingGodkjent: null,
  vilkarType: null,
  vurderPaNyttArsaker: null,
  venteårsak: {
    kode: '-',
    kodeverk: 'VENT_AARSAK',
  },
};

const submitCallback = sinon.spy();

describe('<ArbeidsforholdInfoPanel>', () => {
  it('Skal vise komponenten korrekt med aksjonspunkt hvor man ikke kan legge til nye arbeidsforhold', () => {
    const wrapper = shallow(
      <ArbeidsforholdInfoPanelImpl
        intl={intlMock}
        aksjonspunkter={[ap5080]}
        readOnly={false}
        submitCallback={submitCallback}
        arbeidsforhold={[]}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
    );
    const apMsg = wrapper.find('MemoizedFormattedMessage');
    expect(apMsg).has.length(2);
    expect(apMsg.at(0).prop('id')).is.eql('ArbeidsforholdInfoPanel.AvklarArbeidsforhold');
    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(1);
    expect(wrapper.find(BekreftOgForsettKnapp)).has.length(1);
  });

  it('Skal vise komponenten korrekt uten aksjonspunkt hvor man kan legge til nye arbeidsforhold', () => {
    const wrapper = shallow(
      <ArbeidsforholdInfoPanelImpl
        intl={intlMock}
        aksjonspunkter={[]}
        submitCallback={submitCallback}
        arbeidsforhold={[]}
        readOnly={false}
        hasOpenAksjonspunkter={false}
        behandlingId={1}
        behandlingVersjon={1}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        alleMerknaderFraBeslutter={{}}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(PersonArbeidsforholdPanel)).has.length(1);
    expect(wrapper.find(BekreftOgForsettKnapp)).has.length(0);
    expect(wrapper.find(AksjonspunktHelpText)).has.length(0);
  });
});
