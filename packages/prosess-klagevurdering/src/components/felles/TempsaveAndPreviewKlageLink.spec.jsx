import klageVurderingType from '@k9-sak-web/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
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
        saveKlage={vi.fn()}
        aksjonspunktCode="123"
        previewCallback={vi.fn()}
      />,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Lagre og forhåndsvis brev' })).toBeInTheDocument();
  });
});
