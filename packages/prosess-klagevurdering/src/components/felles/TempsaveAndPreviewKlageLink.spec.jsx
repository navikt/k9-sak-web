import sinon from 'sinon';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme/build';
import {TempsaveAndPreviewKlageLink} from './TempsaveAndPreviewKlageLink';


describe('<TempsaveAndPreviewKlageLink>', () => {
  const formValuesWithEmptyStrings = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: '',
    begrunnelse: '',
  };


  it('Skal rendre komponent korrekt', () => {
    const wrapper = shallow(<TempsaveAndPreviewKlageLink
      formValues={formValuesWithEmptyStrings}
      saveKlage={sinon.spy()}
      aksjonspunktCode="123"
      previewCallback={sinon.spy()}
    />);
    expect(wrapper.find('a')).has.length(1);
  });
});
