import klageVurderingType from '@k9-sak-web/kodeverk/src/klageVurdering';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
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
