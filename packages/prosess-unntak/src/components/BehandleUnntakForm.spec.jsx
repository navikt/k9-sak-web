import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { BehandleUnntakForm } from './BehandleUnntakForm';

describe('<BehandleKlageFormKaImpl>', () => {
  const språkkode = {
    kode: 'NO',
    navn: 'Norsk',
  };
  const formValues1 = {
    fritekst: '123',
    behandlingResultatType: behandlingResultatType.INNVILG,
  };

  it('skal vise valgbare skjemelementer når readonly er false', () => {
    renderWithIntlAndReduxForm(
      <BehandleUnntakForm
        readOnly={false}
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
        formValues={formValues1}
        previewCallback={vi.fn()}
        saveUnntak={vi.fn()}
        intl={intlMock}
        formProps={{}}
        språkkode={språkkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Notat' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Innvilget eller endring' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Avslå eller ingen endring' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal ikke vise valgbare skjemelementer når readonly er true', () => {
    renderWithIntlAndReduxForm(
      <BehandleUnntakForm
        readOnly
        readOnlySubmitButton
        aksjonspunktCode={aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR}
        formValues={formValues1}
        previewCallback={vi.fn()}
        saveUnntak={vi.fn()}
        intl={intlMock}
        formProps={{}}
        språkkode={språkkode}
        alleKodeverk={{}}
        {...reduxFormPropsMock}
      />,
      { messages },
    );

    expect(screen.queryByRole('textbox', { name: 'Notat' })).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Innvilget eller endring' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Avslå eller ingen endring' })).toBeDisabled();
  });
});
