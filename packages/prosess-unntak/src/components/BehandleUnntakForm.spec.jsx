import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import unntakVurdering from '@fpsak-frontend/kodeverk/src/unntakVurdering';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { BehandleUnntakFormImpl } from './BehandleUnntakForm';
import shallowWithIntl from '../../i18n';

describe('<BehandleKlageFormKaImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const formValues1 = {
    fritekst: '123',
    unntakVurdering: unntakVurdering.INNVILG,
  };

  xit('skal vise lenke til forhåndsvis brev når fritekst er fylt, og klagevurdering valgt', () => {
    const wrapper = shallowWithIntl(
      <BehandleUnntakFormImpl
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.MANUELL_VURDERING_VILKÅR}
        formValues={formValues1}
        previewCallback={sinon.spy()}
        saveUnntak={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(TempSaveAndPreviewKlageLink)).to.have.length(1);
  });
  const formValues2 = {
    fritekst: '123',
  };

  xit('skal ikke vise lenke til forhåndsvis brev når fritekst fylt, og klagevurdering ikke valgt', () => {
    const wrapper = shallowWithIntl(
      <BehandleUnntakFormImpl
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues2}
        aksjonspunktCode={aksjonspunktCodes.MANUELL_VURDERING_VILKÅR}
        previewCallback={sinon.spy()}
        saveUnntak={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(TempSaveAndPreviewKlageLink)).to.have.length(0);
  });
  const formValues3 = {
    unntakVurdering: unntakVurdering.AVSLÅ,
  };

  xit('skal ikke vise lenke til forhåndsvis brev når fritekst ikke fylt, og klagevurdering valgt', () => {
    const wrapper = shallowWithIntl(
      <BehandleUnntakFormImpl
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues3}
        aksjonspunktCode={aksjonspunktCodes.MANUELL_VURDERING_VILKÅR}
        previewCallback={sinon.spy()}
        saveUnntak={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
    );
    expect(wrapper.find(TempSaveAndPreviewKlageLink)).to.have.length(0);
  });
});
