import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { FormkravKlageFormKa } from './FormkravKlageFormKa';

describe('<FormkravKlageFormKa>', () => {
  it('skal initiere form', () => {
    renderWithIntlAndReduxForm(
      <FormkravKlageFormKa
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA}
        intl={intlMock}
        behandlingId={1}
        behandlingVersjon={1}
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
