import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import VilkarresultatMedBegrunnelse from './VilkarresultatMedBegrunnelse';
import { VilkarresultatMedOverstyringForm } from './VilkarresultatMedOverstyringForm';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    const wrapper = shallow(
      <VilkarresultatMedOverstyringForm
        {...reduxFormPropsMock}
        erVilkarOk
        isReadOnly
        overstyringApKode="5011"
        avslagsarsaker={[
          { kode: 'test1', navn: 'test' },
          { kode: 'test2', navn: 'test' },
        ]}
        lovReferanse="§23"
        hasAksjonspunkt
        behandlingspunkt="foedsel"
        overrideReadOnly={false}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        aksjonspunktCodes={[]}
        toggleOverstyring={() => undefined}
        erMedlemskapsPanel={false}
        panelTittelKode="Fødsel"
        erOverstyrt
      />,
    );

    const melding = wrapper.find(FormattedMessage);
    expect(melding).to.have.length(3);

    const vilkarResultatMedBegrunnelse = wrapper.find(VilkarresultatMedBegrunnelse);
    expect(vilkarResultatMedBegrunnelse).to.have.length(1);
  });
});
