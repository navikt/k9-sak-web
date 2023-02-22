import React from 'react';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import TempSaveAndPreviewKlageLink from '@fpsak-frontend/prosess-klagevurdering/src/components/felles/TempSaveAndPreviewKlageLink';
import { BehandleUnntakForm } from './BehandleUnntakForm';
import shallowWithIntl from '../../i18n';

describe('<BehandleKlageFormKaImpl>', () => {
  const sprakkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const formValues1 = {
    fritekst: '123',
    behandlingResultatType: behandlingResultatType.INNVILG,
  };

  it.skip('skal vise lenke til forhåndsvis brev når fritekst er fylt, og klagevurdering valgt', () => {
    const wrapper = shallowWithIntl(
      <BehandleUnntakForm
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
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

  it.skip('skal ikke vise lenke til forhåndsvis brev når fritekst fylt, og klagevurdering ikke valgt', () => {
    const wrapper = shallowWithIntl(
      <BehandleUnntakForm
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues2}
        aksjonspunktCode={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
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
    behandlingResultatType: behandlingResultatType.AVSLÅ,
  };

  it.skip('skal ikke vise lenke til forhåndsvis brev når fritekst ikke fylt, og klagevurdering valgt', () => {
    const wrapper = shallowWithIntl(
      <BehandleUnntakForm
        readOnly={false}
        readOnlySubmitButton
        formValues={formValues3}
        aksjonspunktCode={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
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
