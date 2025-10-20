import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import messages from '../../../i18n/nb_NO.json';
import TempsaveKlageButton from './TempsaveKlageButton';

describe('<TempsaveKlageButton>', () => {
  const formValuesWithEmptyStrings = {
    klageVurdering: klageVurderingType.STADFESTE_YTELSESVEDTAK,
    fritekstTilBrev: '',
    begrunnelse: '',
  };

  it('Skal rendre komponent korrekt', () => {
    renderWithIntlAndReduxForm(
      <TempsaveKlageButton
        formValues={formValuesWithEmptyStrings}
        saveKlage={vi.fn()}
        aksjonspunktCode="123"
        hasForeslaVedtakAp={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Lagre' })).toBeInTheDocument();
  });
});
