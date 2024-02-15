import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import TempsaveButton from './TempsaveButton';

describe('<TempsaveButton>', () => {
  const formValuesWithEmptyStrings = {
    behandlingResultatType: behandlingResultatType.INNVILGET,
    begrunnelse: '',
  };

  it('Skal rendre komponent korrekt', () => {
    renderWithIntl(
      <TempsaveButton
        formValues={formValuesWithEmptyStrings}
        saveUnntak={sinon.spy()}
        aksjonspunktCode="123"
        hasForeslaVedtakAp={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Lagre' })).toBeInTheDocument();
  });
});
