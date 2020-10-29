import sinon from 'sinon';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme/build';
import { TempSaveAndPreviewLink } from './TempSaveAndPreviewLink';

describe('<TempSaveAndPreviewLink>', () => {
  const formValuesWithEmptyStrings = {
    unntakVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekst: '',
    begrunnelse: '',
  };

  xit('Skal rendre komponent korrekt', () => {
    const wrapper = shallow(
      <TempSaveAndPreviewLink
        formValues={formValuesWithEmptyStrings}
        saveUnntak={sinon.spy()}
        aksjonspunktCode="123"
        previewCallback={sinon.spy()}
      />,
    );
    expect(wrapper.find('a')).has.length(1);
  });
});
