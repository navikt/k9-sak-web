import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
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
        saveUnntak={vi.fn()}
        aksjonspunktCode="123"
        hasForeslaVedtakAp={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Lagre' })).toBeInTheDocument();
  });
});
