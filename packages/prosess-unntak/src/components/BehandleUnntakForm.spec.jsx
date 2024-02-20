import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { intlMock } from '@fpsak-frontend/utils-test/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import messages from '../../i18n/nb_NO.json';
import { BehandleUnntakForm } from './BehandleUnntakForm';

describe('<BehandleKlageFormKaImpl>', () => {
  const sprakkode = {
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
        previewCallback={sinon.spy()}
        saveUnntak={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
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
        previewCallback={sinon.spy()}
        saveUnntak={sinon.spy()}
        intl={intlMock}
        formProps={{}}
        sprakkode={sprakkode}
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
