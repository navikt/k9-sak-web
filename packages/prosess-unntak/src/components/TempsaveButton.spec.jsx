import sinon from 'sinon';
import { expect } from 'chai';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

import { shallow } from 'enzyme/build';
import TempsaveButton from './TempsaveButton';

describe('<TempsaveButton>', () => {
  const formValuesWithEmptyStrings = {
    behandlingResultatType: behandlingResultatType.INNVILGET,
    begrunnelse: '',
  };

  it('Skal rendre komponent korrekt', () => {
    const wrapper = shallow(
      <TempsaveButton
        formValues={formValuesWithEmptyStrings}
        saveUnntak={sinon.spy()}
        aksjonspunktCode="123"
        hasForeslaVedtakAp={false}
      />,
    );
    expect(wrapper.find(Knapp)).has.length(1);
  });
});
