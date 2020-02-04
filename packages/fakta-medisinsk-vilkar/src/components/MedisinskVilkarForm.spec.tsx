import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-medisinsk-vilkar';
import BeredskapRadio from './BeredskapRadio';
import DiagnoseRadio from './DiagnoseRadio';
import InnlagtBarnRadio from './InnlagtBarnRadio';
import Legeerklaering from './Legeerklaering';
import { MedisinskVilkarForm } from './MedisinskVilkarForm';
import MedisinskVilkarFormButtons from './MedisinskVilkarFormButtons';
import OmsorgspersonerRadio from './OmsorgspersonerRadio';

describe('<MedisinskVilkarForm>', () => {
  it('skal rendre form', () => {
    const wrapper = shallowWithIntl(
      <MedisinskVilkarForm
        {...reduxFormPropsMock}
        behandlingId={1}
        behandlingVersjon={1}
        readOnly={false}
        submitCallback={sinon.spy()}
        hasOpenAksjonspunkter
        submittable
        intl={intlMock}
        hasDiagnose
        isInnlagt
        toOmsorgspersoner
      />,
    );
    expect(wrapper.find(InnlagtBarnRadio)).has.length(1);
    expect(wrapper.find(OmsorgspersonerRadio)).has.length(1);
    expect(wrapper.find(BeredskapRadio)).has.length(1);
    expect(wrapper.find(DiagnoseRadio)).has.length(1);
    expect(wrapper.find(Legeerklaering)).has.length(1);
    expect(wrapper.find(MedisinskVilkarFormButtons)).has.length(1);
  });
});
