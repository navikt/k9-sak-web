import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import SoknadsfristVilkarBegrunnelse from './SoknadsfristVilkarBegrunnelse';
import { SoknadsfristVilkarForm } from './SoknadsfristVilkarForm';

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    const wrapper = shallow(
      <SoknadsfristVilkarForm
        {...reduxFormPropsMock}
        erVilkarOk
        isReadOnly
        avslagsarsaker={[
          { kode: 'test1', navn: 'test1', kodeverk: 'test' },
          { kode: 'test2', navn: 'test1', kodeverk: 'test' },
        ]}
        lovReferanse="§23"
        harAksjonspunkt
        harÅpentAksjonspunkt={false}
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        erOverstyrt
        aksjonspunkter={[]}
        behandlingsresultat={{
          type: { kode: 'test', kodeverk: 'test' },
        }}
        behandlingId={1}
        behandlingVersjon={2}
        behandlingType={{
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        }}
        medlemskapFom="10.10.2010"
        status=""
        submitCallback={() => undefined}
        isSolvable
        periodeFom="2019-01-01"
        periodeTom="2020-01-01"
      />,
    );

    const melding = wrapper.find(FormattedMessage);
    expect(melding).toHaveLength(3);

    const vilkarResultatMedBegrunnelse = wrapper.find(SoknadsfristVilkarBegrunnelse);
    expect(vilkarResultatMedBegrunnelse).toHaveLength(1);
  });
});
