import sinon from 'sinon';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme/build';
import { TempSaveAndPreviewLink } from './TempSaveAndPreviewLink';

describe('<TempSaveAndPreviewLink>', () => {
  const formValuesWithEmptyStrings = {
    behandlingResultatType: behandlingResultatType.INNNVILGET,
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
