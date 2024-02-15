import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { FormkravKlageFormNfpImpl } from './FormkravKlageFormNfp';

describe('<FormkravKlageFormNfp>', () => {
  it('skal initiere fomrkrav-form', () => {
    renderWithIntlAndReduxForm(
      <FormkravKlageFormNfpImpl
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP}
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={2}
        alleKodeverk={{}}
        arbeidsgiverOpplysningerPerId={{}}
        fagsakPerson={{}}
        avsluttedeBehandlinger={[]}
        parterMedKlagerett={[]}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Vurder formkrav' })).toBeInTheDocument();
  });
});
