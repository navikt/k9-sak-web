import sinon from 'sinon';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { expect } from 'chai';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import { shallow } from 'enzyme/build';
import TempsaveButton from './TempsaveButton';

describe('<TempsaveButton>', () => {
  const formValuesWithEmptyStrings = {
    unntakVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: '',
    begrunnelse: '',
  };

  xit('Skal rendre komponent korrekt', () => {
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
