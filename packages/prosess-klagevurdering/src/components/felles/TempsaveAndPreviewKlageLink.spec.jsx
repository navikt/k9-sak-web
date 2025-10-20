import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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

    expect(screen.getByTestId('previewLink')).toBeInTheDocument();
  });
});
