import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../../../i18n/nb_NO.json';
import { TempSaveAndPreviewKlageLink } from './TempSaveAndPreviewKlageLink';

describe('<TempSaveAndPreviewKlageLink>', () => {
  const formValuesWithEmptyStrings = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: '',
    begrunnelse: '',
  };

  it('Skal rendre komponent korrekt', () => {
    renderWithIntlAndReduxForm(
      <TempSaveAndPreviewKlageLink
        formValues={formValuesWithEmptyStrings}
        saveKlage={sinon.spy()}
        aksjonspunktCode="123"
        previewCallback={sinon.spy()}
      />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Lagre og forhåndsvis brev' })).toBeInTheDocument();
  });
});
